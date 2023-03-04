import db  from "lib/db";

const account = db.collection('account');

const handleDiscordVerify = async (req, res) => {
  const { code, state: wallet } = req.query;

  if (!wallet) {
    return res.json({
      status: 'ERROR',
      code: 408,
      message: 'Invalid session, please reconnect your wallet'
    })
  }

  const authData = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      state: wallet,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/discord/verify`,
      scope: 'identify guilds guilds.members.read',
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json())
    .catch(e => {
      console.error(e.message)

      return {
        token_type: `Bearer`,
        access_token: null,
        refresh_token: null,
      };
    });

  const data = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${authData.token_type} ${authData.access_token}`
    }
  }).then(response => response.json())
    .catch(e => {
      console.error(e.message)

      return {
        username: `USER`
      };
    });

  if (data.username !== 'USER') {
    const otherAccount = await account.findOne({
      discord_id: data.id,
      wallet: { $ne: wallet }
    }).catch(() => null);

    if (otherAccount) {
      return res.json({
        status: 'ERROR',
        code: 408,
        message: 'Your discord already have connected to another account.'
      })
    }

    const existingAccount = await account.findOne({
      wallet: wallet
    }).catch(() => null);

    if (!existingAccount) {
      await account.insertOne({
        wallet: wallet
      })
    }

    await account.updateOne({
      wallet: wallet
    }, {
      $set: {
        discord_id: data.id,
        discord_username: `${data.username}#${data.discriminator}`,
        discord_avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.jpeg`,
        discord_code: code,
        discord_access_token: authData.access_token,
        discord_refresh_token: authData.refresh_token
      }
    });
  }

  return res.redirect('/quest');
};

export default handleDiscordVerify;