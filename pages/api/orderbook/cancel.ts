import {NextApiRequest, NextApiResponse} from "next"
import { Redis } from '@upstash/redis'
import db from "lib/db"
import {ConsiderationItem, ItemType, OfferItem, Orders} from "types/nftearth.d"

const redis = Redis.fromEnv()
const NFTItem = [ItemType.ERC721, ItemType.ERC1155, ItemType.ERC721_WITH_CRITERIA, ItemType.ERC1155_WITH_CRITERIA]
const account = db.collection('account')

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
  const nft: ConsiderationItem[] | OfferItem[] = parameters.offer.filter(o => NFTItem.includes(o.itemType))

  const accountData = await account.findOne({
    wallet: { $regex : `^${parameters.offerer}$`, '$options' : 'i'}
  }).catch(() => null)

  console.info(`Cancel order`, accountData, parameters)

  const canceledReward = await redis
    .get(`list:${chainId}:${parameters.offerer}:${nft[0]?.token}:${nft[0]?.identifierOrCriteria}`)
    .then((res) => res as number)
    .catch(() => null)

  if (accountData && canceledReward) {
    await redis.del(`list:${chainId}:${parameters.offerer}:${nft[0]?.token}:${nft[0]?.identifierOrCriteria}`)

    await account.updateOne({
      wallet: { $regex : `^${parameters.offerer}$`, '$options' : 'i'}
    }, {
      $inc: {
        listingExp: -canceledReward,
        exp: -canceledReward
      }
    })
  }

  return res.json({
    message: 'Cancel Accepted'
  })
}

export default handleOrderbookCancel