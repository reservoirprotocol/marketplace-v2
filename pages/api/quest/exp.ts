import db from "lib/db";
import {NextApiRequest, NextApiResponse} from "next";

const account = db.collection('account')

const handleQuestExp = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;

  const accountData = await account.findOne({
    wallet: address
  })

  return accountData?.exp || 0
}

export default handleQuestExp;