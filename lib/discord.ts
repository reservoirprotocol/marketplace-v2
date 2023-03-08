export const discordRefreshToken = (refresh_token: string) => {
  return fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET  as string,
      refresh_token: refresh_token,
      grant_type: 'refresh_token',
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((response: Response) => response.json())
    .catch(e => {
      console.error(e.message)

      return {
        token_type: `Bearer`,
        access_token: null,
        refresh_token: null,
      };
    });
}