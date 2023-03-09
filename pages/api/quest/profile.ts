import db from "lib/db";
import {NextApiRequest, NextApiResponse} from "next";

const account = db.collection('account')

const handleProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;

  const accountData = await account.findOne({
    wallet: address
  })

  return res.json(accountData || null)
}

export default handleProfile;