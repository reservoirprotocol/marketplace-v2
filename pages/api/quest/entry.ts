import { Redis } from '@upstash/redis'
import { oauth} from "../social/twitter"
import { intersectionBy } from "utils/array"
import { discordRefreshToken } from "lib/discord"
import db from 'lib/db'
import {paths} from "@nftearth/reservoir-sdk"
import fetcher from "utils/fetcher"
import supportedChains from "utils/chains"
import type {NextApiRequest, NextApiResponse} from "next"
import quests from 'data/quests.json'

const redis = Redis.fromEnv()
const account = db.collection('account')
const questEntry = db.collection('quest_entry')

type QuestEntryRole = {
  id: string
  name: string
  multiplier: number
}

type QuestConnection = {
  type: 'connection'
  name: string
  passes?: boolean
  disconnected?: boolean
}

type QuestDiscord = {
  type: 'discord'
  id: string
  roles?: QuestEntryRole[]
  entryRole?: QuestEntryRole
  passes?: boolean
  disconnected?: boolean
}

type QuestTwitterFollow =  {
  type: 'twitter_follow'
  user: string
  passes?: boolean
  disconnected?: boolean
}

type QuestTwitterLike =  {
  type: 'twitter_like'
  id: string
  passes?: boolean
  disconnected?: boolean
}

type QuestTwitterRetweet =  {
  type: 'twitter_retweet'
  id: string
  passes?: boolean
  disconnected?: boolean
}

type QuestTwitterLikeRetweet = {
  type: 'twitter_like_retweet'
  id: string
  passes?: boolean
  disconnected?: boolean
}

type QuestListMarket = {
  type: 'list'
  currency?: string
  passes?: boolean
  count?: number
  double_count?: number
  double_exp?: boolean
  disconnected?: boolean
}

type QuestBidMarket = {
  type: 'bid'
  currency?: string
  passes?: boolean
  disconnected?: boolean
}

type QuestBuyMarket = {
  type: 'buy'
  currency?: string
  amount?: string
  passes?: boolean
  disconnected?: boolean
}

export type QuestTask = QuestConnection | QuestDiscord | QuestTwitterFollow | QuestTwitterRetweet | QuestTwitterLike | QuestTwitterLikeRetweet | QuestListMarket | QuestBidMarket | QuestBuyMarket
export type Quest = {
  id: number
  tasks: QuestTask[]
  exp: number
  start_time?: number
  end_time?: number
}

const getMember = (guild_id: string, access_token: string) => fetch(`https://discord.com/api/v10/users/@me/guilds/${guild_id}/member`, {
  headers: {
    authorization: `Bearer ${access_token}`
  }
}).then(response => response.json())
  .catch(e => {
    console.error(e.message)

    return []
  })

const handleQuestEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  
  const { questId, wallet } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

  if (!wallet) {
    return res.json({
      status: 'ERROR',
      code: 408,
      message: 'Invalid session, please reconnect your wallet',
      quest_id: questId
    })
  }

  const questData: Quest | undefined = (quests as unknown as Quest[]).find(q => q.id === +questId);

  if (!questData) {
    return res.json({
      status: 'ERROR',
      code: 404,
      message: 'Quest not found',
      quest_id: questId
    })
  }

  let accountData = await account.findOne({
    wallet: wallet
  })

  if (!accountData) {
    await account.insertOne({
      wallet: wallet,
      exp: 0
    })

    accountData = await account.findOne({
      wallet: wallet
    })
  }

  const questEntryData = await questEntry.findOne({
    quest_id: questId,
    $or: [
      {
        wallet: wallet
      },
      accountData?.discord_id && {
        discord_id: accountData?.discord_id,
      },
      accountData?.twitter_id && {
        twitter_id: accountData?.twitter_id
      }
    ].filter(Boolean)
  })

  if (questEntryData) {
    return res.json({
      status: 'ERROR',
      code: 403,
      message: 'You already completed this quest',
      quest_id: questId
    })
  }

  const now = Math.floor(Date.now() / 1000)

  if (questData.end_time && questData.end_time < now) {
    return res.json({
      status: 'ERROR',
      code: 405,
      message: 'Quest has ended',
      quest_id: questId
    })
  }

  if (questData.start_time && questData.start_time < now) {
    return res.json({
      status: 'ERROR',
      code: 405,
      message: 'Quest not started',
      quest_id: questId
    })
  }

  let cachedEntry: QuestTask[] = await redis
    .get(`entry:${questData.id}:${accountData?.wallet}`)
    .then((res: any) => JSON.parse(res))
    .catch(() => null) || []

  const tasks = await Promise.all((questData.tasks || []).map(async (r: QuestTask) => {
    if (r.type === 'connection') {
      const isConnectedWallet = !!(r.name === 'wallet' && accountData?.wallet)
      const isConnectedDiscord = !!(r.name === 'discord' && accountData?.discord_id)
      const isConnectedTwitter = !!(r.name === 'twitter' && accountData?.twitter_id)

      r.passes = isConnectedWallet || isConnectedDiscord || isConnectedTwitter
    }
    if (r.type === 'discord') {
      const cachedDiscordEntry = cachedEntry.find((e) => e.type === 'discord' && e.id === r.id)
      if (cachedDiscordEntry) {
        r.passes = true

        return r
      }

      if (!accountData?.discord_id) {
        return r
      }

      if (r.id === '') {
        r.passes = true

        return r
      }

      if (!accountData?.discord_access_token && accountData?.discord_id) {
        r.disconnected = true
        r.passes = false

        return r
      }

      let member: any = await getMember(r.id, accountData?.discord_access_token)
      if (!member.user) {
        const authData = await discordRefreshToken(accountData?.discord_refresh_token)

        if (authData.access_token) {
          await account.updateOne({
            wallet: wallet
          }, {
            $set: {
              discord_access_token: authData.access_token,
              discord_refresh_token: authData.refresh_token
            }
          })

          member = await getMember(r.id, authData.access_token)
        }
      }

      r.passes = !!member.user

      if (r.roles) {
        const intersections = intersectionBy(r.roles, (member.roles || []).map((m: string) => ({ id: m })), 'id')
        r.passes = intersections.length > 0
        if (r.passes) {
          r.entryRole = intersections.sort((a, b) => b.multiplier - a.multiplier)[0]
        }
      }
    }

    if (r.type === 'twitter_follow') {
      if (!accountData || !accountData?.twitter_oauth_token) {
        return r
      }

      const cachedTwitterFollow = cachedEntry.find(e => e.type === 'twitter_follow' && e.user === r.user)
      if (cachedTwitterFollow) {
        r.passes = true

        return r
      }

      if (r.user.replace('@', '').toLowerCase() === accountData?.twitter_username.toLowerCase()) {
        r.passes = true

        return r
      }

      if (!accountData?.twitter_oauth_token && accountData?.twitter_id) {
        r.disconnected = true
        r.passes = false
        return r
      }

      const token = {
        key: accountData?.twitter_oauth_token,
        secret: accountData?.twitter_oauth_token_secret
      }

      const getPage = async (nextToken: string) => {
        const twitterFollowUrl = `${process.env.TWITTER_API_URL}/users/${accountData?.twitter_id}/following?max_results=1000&user.fields=username${nextToken ? `&pagination_token=${nextToken}` : ''}`

        const authHeader = oauth.toHeader(oauth.authorize({
          url: twitterFollowUrl,
          method: 'GET'
        }, token))

        return await fetch(`${twitterFollowUrl}`, {
          headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "NFTEarth"
          }
        }).then(response => response.json())
          .catch((e) => {
            console.log(e.message)

            return { data: [] }
          })
      }

      let hasNextPage = true
      let nextToken = null

      while (hasNextPage && !r.passes) {
        let resp: any = await getPage(nextToken)
        if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
          if (resp.data) {
            r.passes = !!(resp.data || []).find((d: any) => d.username.toLowerCase() === r.user.replace('@', '').toLowerCase())
          }
          if (resp.meta.next_token) {
            nextToken = resp.meta.next_token
          } else {
            hasNextPage = false
          }
        } else {
          hasNextPage = false
        }
      }

      // TODO: Get Twitter Elevated Access & Use this Method Instead
      // const twitterFollowUrl = `https://api.twitter.com/1.1/friendships/show.json?source_id=${twitterId}&target_screen_name=${r.user}`
      //
      // const authHeader = oauth.toHeader(oauth.authorize({
      //   url: twitterFollowUrl,
      //   method: 'GET'
      // }, token))
      //
      // const { relationship } = await fetch(twitterFollowUrl, {
      //   headers: {
      //     Authorization: authHeader["Authorization"],
      //     'user-agent': "NFTEarth"
      //   }
      // }).then(response => response.json())
      //   .catch((e) => {
      //     console.log(e.message)
      //
      //     return { relationship: {} }
      //   })
      //
      // // console.log('relationship', data)
      //
      // r.passes = relationship?.target?.following
    }

    if (r.type === 'twitter_like_retweet' || r.type === 'twitter_like' || r.type === 'twitter_retweet') {
      if (!accountData || !accountData?.twitter_oauth_token) {
        return r
      }

      const cachedTwitterRetweet = cachedEntry.find(e => (e.type === 'twitter_like_retweet' || e.type === 'twitter_retweet' || e.type === 'twitter_like') && e.id === r.id)
      if (cachedTwitterRetweet) {
        r.passes = true

        return r
      }

      const token = {
        key: accountData?.twitter_oauth_token,
        secret: accountData?.twitter_oauth_token_secret
      }

      if (!accountData?.twitter_oauth_token && accountData?.twitter_id) {
        r.disconnected = true
        r.passes = false
        return r
      }

      const endpointURL = `${process.env.TWITTER_API_URL}/users/${accountData?.twitter_id}/tweets?tweet.fields=referenced_tweets&max_results=100&exclude=replies&expansions=referenced_tweets.id`

      const authHeader = oauth.toHeader(oauth.authorize({
        url: endpointURL,
        method: 'GET'
      }, token))

      const {data: retweetData} = await fetch(endpointURL,
        {
          method: 'GET',
          headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "NFTEarth"
          }
        }
      ).then(response => response.json())
        .catch((e) => {
          console.log(e.message)

          return {data: []}
        })

      r.passes = !!(retweetData || []).find((d: any) => {
        return d.referenced_tweets?.find((t: any) => t.id === r.id)
      })
    }

    if (r.type === 'list') {
      const getListing = async (continuation: any) => {
        const listingQuery: paths["/orders/asks/v4"]["get"]["parameters"]["query"] = {
          source: 'nftearth.exchange',
          includePrivate: true,
          maker: wallet,
          limit: r.currency ? 1000 : 1
        }

        const promises: ReturnType<typeof fetcher>[] = []
        supportedChains.forEach((chain, i) => {
          if (continuation[i] !== null) {
            if (continuation[i]) {
              listingQuery.continuation = continuation[i]
            }

            promises.push(
              fetcher(`${chain.reservoirBaseUrl}/orders/asks/v4`, listingQuery, {
                headers: {
                  'x-api-key': chain.apiKey || '',
                },
              })
            )
          }
        })

        const responses = await Promise.allSettled(promises)
        let newContinuation: any = [];
        responses.forEach((response, i) => {
          newContinuation[i] = null;
          if (response.status === 'fulfilled' && response.value.data) {
            newContinuation[i] = response.value.data.continuation;
          }
        })

        return {
          data: responses,
          continuation: newContinuation
        };
      }

      let hasNextPage = true
      let continuation = new Array(supportedChains.length).fill(undefined);

      while (hasNextPage && !r.passes) {
        let result: any = await getListing(continuation)
        result.data.forEach((resp: any) => {
          if (resp && resp.value.data && resp.value.data.orders.length > 0) {
            r.passes = true;

            if (r.currency) {
              const orders = resp.value.data.orders.filter((r: any) => r.price.currency.symbol === r.currency);
              r.passes = orders.length >= (r.count || 1)
              r.double_exp = orders.length >= (r.double_count || orders.length + 1)
            }
          } else {
            hasNextPage = false
          }
        })
        if (!!result.continuation.find((c: string) => c !== null)) {
          continuation = result.continuation
        } else {
          hasNextPage = false
        }
      }
    }

    if (r.type === 'bid') {
      const getBuy = async (continuation: any) => {
        const buyQuery: paths["/users/activity/v5"]["get"]["parameters"]["query"] = {
          users: wallet,
          types: ["bid"],
          limit: 20
        }

        const promises: ReturnType<typeof fetcher>[] = []
        supportedChains.forEach((chain, i) => {
          if (continuation[i] !== null) {
            if (continuation[i]) {
              buyQuery.continuation = continuation[i]
            }

            promises.push(
              fetcher(`${chain.reservoirBaseUrl}/users/activity/v5`, buyQuery, {
                headers: {
                  'x-api-key': chain.apiKey || '',
                },
              })
            )
          }
        })

        const responses = await Promise.allSettled(promises)
        let newContinuation: any = [];
        responses.forEach((response, i) => {
          newContinuation[i] = null;
          if (response.status === 'fulfilled' && response.value.data) {
            newContinuation[i] = response.value.data.continuation;
          }
        })

        return {
          data: responses,
          continuation: newContinuation
        };
      }

      let hasNextPage = true
      let continuation = new Array(supportedChains.length).fill(undefined);

      while (hasNextPage && !r.passes) {
        let result: any = await getBuy(continuation)
        result.data.forEach((resp: any) => {
          if (resp && resp.value.data && resp.value.data.activities.length > 0) {
            r.passes = resp.value.data.activities.filter((r: any) => r.order.source.domain === 'nftearth.exchange').length > 0;
          } else {
            hasNextPage = false
          }
        })

        if (!!result.continuation.find((c: string) => c !== null)) {
          continuation = result.continuation
        } else {
          hasNextPage = false
        }
      }
    }

    if (r.type === 'buy') {
      const getBuy = async (continuation: any) => {
        const buyQuery: paths["/users/activity/v5"]["get"]["parameters"]["query"] = {
          users: wallet,
          types: ["sale"],
          limit: 20
        }

        const promises: ReturnType<typeof fetcher>[] = []
        supportedChains.forEach((chain, i) => {
          if (continuation[i] !== null) {
            if (continuation[i]) {
              buyQuery.continuation = continuation[i]
            }

            promises.push(
              fetcher(`${chain.reservoirBaseUrl}/users/activity/v5`, buyQuery, {
                headers: {
                  'x-api-key': chain.apiKey || '',
                },
              })
            )
          }
        })

        const responses = await Promise.allSettled(promises)
        let newContinuation: any = [];
        responses.forEach((response, i) => {
          newContinuation[i] = null;
          if (response.status === 'fulfilled' && response.value.data) {
            newContinuation[i] = response.value.data.continuation;
          }
        })

        return {
          data: responses,
          continuation: newContinuation
        };
      }

      let hasNextPage = true
      let continuation = new Array(supportedChains.length).fill(undefined);

      let amount = 0;

      while (hasNextPage && !r.passes) {
        let result: any = await getBuy(continuation)
        result.data.forEach((resp: any, i: number) => {
          if (resp && resp.value.data && resp.value.data.activities.length > 0) {
            const entryResult = resp.value.data.activities.filter((r: any) => r.order.source.domain === 'nftearth.exchange' && r.toAddress.toLowerCase() === wallet.toLowerCase());
            r.passes = entryResult.length > 0

            if (r.amount) {
              amount += entryResult.reduce((a: number, b: any) => {
                a += parseInt(b.price)
                return a;
              }, 0)
              r.passes = amount >= parseInt(r.amount)
            }
          } else {
            hasNextPage = false
          }
        })
        if (!!result.continuation.find((c: string) => c !== null)) {
          continuation = result.continuation
        } else {
          hasNextPage = false
        }
      }
    }

    return r
  }))

  await redis.setex(`entry:${questData.id}:${accountData?.wallet}`, 60, JSON.stringify(tasks.filter(f => f.passes)))

  const status = (tasks.length === 0 || tasks.filter(f => !f.passes).length === 0) ? 'SUCCESS' : 'ERROR'

  if (status === 'SUCCESS') {
    await questEntry.insertOne({
      account_id: accountData?._id.toString(),
      quest_id: questData.id,
      discord_id: accountData?.discord_id,
      discord_username: accountData?.discord_username,
      twitter_id: accountData?.twitter_id,
      twitter_username: accountData?.twitter_username,
      wallet: accountData?.wallet,
      entry_role: (tasks.find(r => r.type === 'discord') as QuestDiscord)?.entryRole,
      status: 'complete'
    })

    await account.updateOne({
      wallet
    }, {
      $inc: {
        exp: questData.exp * (!!tasks.find((f: any) => f.double_exp === true) ? 2 : 1)
      }
    })
  }

  let message = status === 'SUCCESS' ? 'Registered' : 'One or more task incomplete'
  const disconnectedSocial = tasks.find(f => f.disconnected)

  if (disconnectedSocial) {
    message = `Please reconnect your ${disconnectedSocial.type} account, and try again in couple minutes.`
  }

  return res.json({
    code: status === 'SUCCESS' ? 200 : 410,
    status,
    message,
    tasks,
    quest_id: questId
  })
}

export default handleQuestEntry