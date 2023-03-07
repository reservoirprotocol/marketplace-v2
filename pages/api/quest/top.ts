import db  from "lib/db";
import type {NextApiRequest, NextApiResponse} from "next";

const account = db.collection('account');

const topExpHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, limit = 500 } = req.query;

  const cursor = await account.aggregate([
    {
      $project: {
        _id: 0,
        wallet: 1,
        exp: 1
      }
    },
    {
      $sort: {
        'exp' : -1
      }
    },
    {
      $skip: (+page - 1) * +limit
    },
    {
      $limit: +limit
    }
  ])
  const top = await cursor.toArray() || [];

  res.status(200).json(top);
}

export default topExpHandler;