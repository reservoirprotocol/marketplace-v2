import type {NextApiRequest, NextApiResponse} from "next"

const handleDiscord = async (req: NextApiRequest, res: NextApiResponse) => {
  const { wallet } = req.query;
  return res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&scope=identify%20guilds%20guilds.members.read&response_type=code&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_HOST_URL}/api/social/discord/verify`)}&state=${wallet}`);
}

export default handleDiscord