import db from "lib/db";
import {NextApiRequest, NextApiResponse} from "next";

const account = db.collection('account')

const handleProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;

  const accountData = await account.findOne({
    wallet: address
  }, {
    projection: {
      twitter_oauth_token: 0,
      twitter_oauth_token_secret: 0,
      discord_code: 0,
      discord_refresh_token: 0,
      discord_access_token: 0
    }
  })

  return res.json(accountData || null)
}

export default handleProfile;