import {NextApiRequest, NextApiResponse} from "next";
import {ethers} from "ethers";
import db from "lib/db";
import {paths} from "@nftearth/reservoir-sdk";
import fetcher from "utils/fetcher";
import supportedChains from "utils/chains";
import {ItemType, Orders} from "types/nftearth";

const NFTItem = [ItemType.ERC721, ItemType.ERC1155];
const medianExpReward = 50
const account = db.collection('account')

const handleOrderbookListings = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.ORDERBOOK_API_KEY) {
    res.status(405).send({message: 'Invalid api key'})
    return
  }
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Only POST requests allowed'})
    return
  }

  const { parameters, chainId, signature } : Orders = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const chain = supportedChains.find(c => c.id === chainId)

  const accountData = await account.findOne({
    wallet: new RegExp(`/^${parameters.offerer}$/`, 'i')
  }).catch(() => null);

  const isListing = parameters.kind === 'token-list'
  const nft = isListing ?
    parameters.offer.find(o => NFTItem.includes(o.itemType)) :
    parameters.consideration.find(o => NFTItem.includes(o.itemType))
  const erc20 = isListing ? parameters.consideration.find(o => o.itemType === ItemType.ERC20) :
    parameters.offer.find(o => o.itemType === ItemType.ERC20)
  const period = parameters.endTime - parameters.startTime

  const collectionQuery: paths["/collections/v5"]["get"]["parameters"]["query"] = {
    id: nft?.token,
    includeTopBid: true
  }

  const { data } = await fetcher(`${chain?.reservoirBaseUrl}/orders/asks/v4`, collectionQuery, {
    headers: {
      'x-api-key': chain?.apiKey || '',
    }
  });

  const collections: paths["/collections/v5"]["get"]["responses"]["200"]["schema"]["collections"] = data?.collections || []
  const collection = collections?.[0];

  if (accountData && collection) {
    // TODO: Calculate reward by floor price & increase reward by listing period & double Reward for NFTE Token
    // const value = ethers.utils.parseUnits(erc20?.startAmount || '0', 'wei')
    // const floorValue = ethers.utils.parseEther(`${collection.floorAsk?.price?.amount?.native}`)
    // const diff = value.sub(floorValue)
    // const mid = value.add(floorValue).div(2)
    // const percentDiff = diff.mul(100).div(mid)
    //
    // accountData.exp += (isListing ? percentDiff.mul(medianExpReward).toNumber().toFixed(2) : percentDiff.mul(-medianExpReward).toNumber().toFixed(2))

    await account.updateOne({
      wallet: new RegExp(`/^${parameters.offerer}$/`, 'i')
    }, {
      $inc: {
        exp: medianExpReward
      }
    })
  }

  return res.json({
    message: 'Listing Accepted'
  })
}

export default handleOrderbookListings;