import OAuth from 'oauth-1.0a'
import qs from 'querystring'
import crypto from 'crypto'
import type {NextApiRequest, NextApiResponse} from "next"

const requestTokenURL = 'https://api.twitter.com/oauth/request_token'
const authorizeURL = 'https://api.twitter.com/oauth/authorize'

export const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY as string,
    secret: process.env.TWITTER_CONSUMER_SECRET as string
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
})

const handleTwitter = async (req: NextApiRequest, res: NextApiResponse) => {
  const { wallet } = req.query

  async function requestToken() {
    const authHeader = oauth.toHeader(oauth.authorize({
      url: requestTokenURL,
      method: 'POST'
    }))

    return fetch(requestTokenURL, {
      method: 'POST',
      headers: {
        Authorization: authHeader["Authorization"]
      },
      body: `oauth_callback=${encodeURIComponent(`${process.env.NEXT_PUBLIC_HOST_URL}/api/twitter/verify?state=${wallet}`)}&state=${wallet}`
    }).then(async res => {
      const text = await res.text()
      return qs.parse(text)
    }).catch((e) => {
      console.error(e.message)
      throw new Error('Cannot get an OAuth request token')
    })
  }

  const oAuthRequestToken = await requestToken().catch(e => console.error(e.message))
  res.setHeader('set-cookie', [`wallet=${wallet}`])
  return res.redirect(`${authorizeURL}?oauth_token=${oAuthRequestToken?.oauth_token}`)
}

export default handleTwitter