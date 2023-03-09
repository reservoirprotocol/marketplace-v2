import {NextApiRequest, NextApiResponse} from "next"
import {ethers} from "ethers"
import db from "lib/db"
import {paths} from "@nftearth/reservoir-sdk"
import fetcher from "utils/fetcher"
import supportedChains from "utils/chains"
import {ConsiderationItem, ItemType, OfferItem, Orders} from "types/nftearth.d"

const NFTItem = [ItemType.ERC721, ItemType.ERC1155]
const PaymentItem = [ItemType.ERC20, ItemType.NATIVE]
const account = db.collection('account')
const EXTRA_REWARD_PER_HOUR_PERIOD=0.000006

const handleOrderbookCancel = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.ORDERBOOK_API_KEY) {
    res.status(405).send({message: 'Invalid api key'})
    return
  }
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Only POST requests allowed'})
    return
  }

  const { parameters, chainId, criteria, signature } : Orders = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const chain = supportedChains.find(c => c.id === chainId)

  const accountData = await account.findOne({
    wallet: { $regex : `^${parameters.offerer}$`, '$options' : 'i'}
  }).catch(() => null)

  const nft: ConsiderationItem[] | OfferItem[] = parameters.offer.filter(o => NFTItem.includes(o.itemType))
  const payment: ConsiderationItem[] | OfferItem[] = parameters.consideration.filter(o => PaymentItem.includes(o.itemType))
  const period = parameters.endTime - parameters.startTime

  const collectionQuery: paths["/collections/v5"]["get"]["parameters"]["query"] = {
    id: nft[0]?.token,
    includeTopBid: true
  }

  const { data } = await fetcher(`${chain?.reservoirBaseUrl}/collections/v5`, collectionQuery, {
    headers: {
      'x-api-key': chain?.apiKey || '',
    }
  })

  const collections: paths["/collections/v5"]["get"]["responses"]["200"]["schema"]["collections"] = data?.collections || []
  const collection = collections?.[0]

  console.info(`Cancel order`, accountData, (accountData && collection), parameters)

  if (accountData && collection) {
    const value = +ethers.utils.formatEther(payment[0]?.startAmount || '0').toString()
    const collectionVolume = +`${collection.volume?.allTime}`
    const topBidValue = +`${collection.topBid?.price?.amount?.native}`
    const floorValue = +`${collection.floorAsk?.price?.amount?.native}`
    const tokenValue = floorValue || topBidValue
    const percentDiff = (tokenValue - value) / ((tokenValue + value) / 2)
    let reward = collectionVolume * tokenValue

    reward += reward * (period * EXTRA_REWARD_PER_HOUR_PERIOD)
    reward += reward * percentDiff

    if (reward < 0 || value <= 0) {
      reward = 0
    }

    const doubleExp = !!payment.find(a => a.token.toLowerCase() === '0xb261104a83887ae92392fb5ce5899fcfe5481456')
    const finalReward = Math.abs(reward * (doubleExp ? 2 : 1))
    await account.updateOne({
      wallet: { $regex : `^${parameters.offerer}$`, '$options' : 'i'}
    }, {
      $inc: {
        listingExp: -finalReward,
        exp: -finalReward
      }
    })
  }

  return res.json({
    message: 'Cancel Accepted'
  })
}

export default handleOrderbookCancel