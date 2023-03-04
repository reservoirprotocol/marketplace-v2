import db  from "lib/db";
import type {NextApiRequest, NextApiResponse} from "next";

const quest = db.collection('quest');
const account = db.collection('account');

const questListHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, limit = 20, wallet } = req.query;

  const accountData = await account.findOne({
    wallet: wallet
  })

  const cursor = await quest.aggregate([
    ...(accountData ? [
      {
        $lookup: {
          from: "quest_entry",
          let: { quest_id: "$id" },
          as: "entry",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ "$quest_id", "$$quest_id" ] },
                    { $eq: [ "$account_id", accountData._id.toString() ] }
                  ]
                }
              }
            },
            {
              $addFields: {
                id: { $toString: "$_id" }
              }
            },
            {
              $project: { _id: 0, "id": 1, "status":1, "account_id": 1}
            },
            {
              $limit: 1
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$entry",
          preserveNullAndEmptyArrays: true
        }
      }
    ] : []),
    {
      $sort: {
        'order' : -1
      }
    },
    {
      $skip: (+page - 1) * +limit
    },
    {
      $limit: +limit
    }
  ]);

  const questList = await cursor.toArray() || [];

  res.status(200).json(questList);
}

export default questListHandler;