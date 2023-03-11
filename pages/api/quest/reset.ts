import type {NextApiRequest, NextApiResponse} from "next";
import db from "lib/db";

const account = db.collection('account')

const rankResetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.ORDERBOOK_API_KEY) {
    res.status(405).send({message: 'Invalid api key'})
    return
  }

  await account.updateMany({}, [
    {
      $set: {
        offerExp: 0,
        listingExp: 0
      }
    }
  ])

  return res.status(200).end('Success');
}

export default rankResetHandler;