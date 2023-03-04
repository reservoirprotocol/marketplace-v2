const handleDiscord = async (req, res) => {
  const { wallet } = req.query;
  return res.redirect(`https://discord.com/oauth2/authorize?client_id=1044315976415576064&scope=identify%20guilds%20guilds.members.read&response_type=code&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/discord/verify`)}&state=${wallet}`);
}

export default handleDiscord;