import { oauth } from "./"
import qs from "querystring"
import db  from "lib/db"
import type {NextApiRequest, NextApiResponse} from "next"

const account = db.collection('account')
export const accessTokenURL = 'https://api.twitter.com/oauth/access_token'

const handleTwitterVerify = async (req: NextApiRequest, res: NextApiResponse) => {
  const { oauth_verifier, oauth_token, state: wallet } = req.query

  if (wallet) {
    return res.json({
      status: 'ERROR',
      code: 408,
      message: 'Invalid session, please reconnect your wallet'
    })
  }

  const authHeader = oauth.toHeader(oauth.authorize({
    url: accessTokenURL,
    method: 'POST'
  }))
  const path = `${accessTokenURL}/?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`
  const data: any = await fetch(path, {
    method: 'POST',
    headers: {
      Authorization: authHeader["Authorization"]
    }
  }).then(async res => {
    const text = await res.text()
    return qs.parse(text)
  }).catch((e) => {
    console.error(e.message)
    return {
      username: 'USER'
    }
  })

  if (data.username !== 'USER') {
    const otherAccount = await account.findOne({
      twitter_id: data.user_id,
      wallet: {$ne: wallet}
    }).catch(() => null)

    if (otherAccount) {
      return res.json({
        status: 'ERROR',
        code: 408,
        message: 'Your twitter already have connected to another account.'
      })
    }

    const existingAccount = await account.findOne({
      wallet: wallet
    }).catch(() => null)

    if (!existingAccount) {
      await account.insertOne({
        wallet: wallet
      })
    }

    await account.updateOne({
      wallet: wallet
    }, {
      $set: {
        twitter_id: data.user_id,
        twitter_username: data.screen_name,
        twitter_avatar: data.profile_image_url_https,
        twitter_oauth_token: data.oauth_token,
        twitter_oauth_token_secret: data.oauth_token_secret,
      }
    })
  }

  return res.redirect('/quest')
}

export default handleTwitterVerify