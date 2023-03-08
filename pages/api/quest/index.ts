import db  from "lib/db";
import type {NextApiRequest, NextApiResponse} from "next";

const questEntry = db.collection('quest_entry');
const account = db.collection('account');

const questEntryListHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { wallet } = req.query;

  const accountData = await account.findOne({
    wallet: wallet
  })

  const cursor = await questEntry.find( {
    account_id: accountData?._id.toString()
  });

  const questList = await cursor.toArray() || [];

  res.status(200).json(questList);
}

export default questEntryListHandler;