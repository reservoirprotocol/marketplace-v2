import OAuth from 'oauth-1.0a';
import qs from 'querystring';
import crypto from 'crypto';

const requestTokenURL = 'https://api.twitter.com/oauth/request_token';
const authorizeURL = 'https://api.twitter.com/oauth/authorize';

export const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

const handleTwitter = async (req, res) => {
  const { wallet } = req.query;

  async function requestToken() {
    const authHeader = oauth.toHeader(oauth.authorize({
      url: requestTokenURL,
      method: 'POST'
    }));

    return fetch(requestTokenURL, {
      method: 'POST',
      headers: {
        Authorization: authHeader["Authorization"]
      },
      body: `oauth_callback=${process.env.NEXTAUTH_URL}/api/twitter/verify&state=${wallet}`
    }).then(async res => {
      const text = await res.text();
      return qs.parse(text);
    }).catch((e) => {
      console.error(e.message)
      throw new Error('Cannot get an OAuth request token');
    })
  }

  const oAuthRequestToken = await requestToken().catch(e => console.error(e.message));
  return res.redirect(`${authorizeURL}?oauth_token=${oAuthRequestToken.oauth_token}`);
}

export default handleTwitter;