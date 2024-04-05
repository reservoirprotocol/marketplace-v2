import { type NextApiRequest, type NextApiResponse } from 'next'
import supportedChains from 'utils/chains'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { params, ...queryParams } = req.query
  // expect that chain is an array of strings, the first element is the chain name
  // the rest of the elements are the rest of the path
  if (!params || !Array.isArray(params) || params.length === 0) {
    res.status(400).send('Invalid chain')
    return
  }
  // look up the host path for the reservoir api
  const host = supportedChains.find(
    (c) => c.routePrefix === params[0]
  )?.reservoirBaseUrl
  if (!host) {
    res.status(400).send('Invalid chain')
    return
  }

  // construct the reservoir api path out of the rest of the path
  const path = params.slice(1).join('/')

  try {
    // create headers with the api key
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.RESERVOIR_API_KEY ?? '',
    }

    // build the reservoir api call url, include query params
    const url = new URL(`${host}/${path}`)
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value as string)
    })

    // fetch the data from the reservoir api
    const response = await fetch(url, { headers })
    const contentType = response.headers.get('content-type')

    if (contentType?.startsWith('image/')) {
      // if the response is an image, we need to convert the fetch arrayBuffer to a node Buffer
      const buffer = await response.arrayBuffer()
      const outputBuffer = Buffer.from(buffer)
      res.setHeader('Content-Type', contentType)
      res.status(response.status).send(outputBuffer)
    } else if (contentType?.startsWith('application/json')) {
      // handle json responses with minimal updates
      const data = (await response.json()) as unknown
      res.setHeader('Content-Type', contentType)
      res.status(response.status).json(data)
    } else {
      // default response, try and get the text body and return
      const data = await response.text()
      res.status(response.status).send(data)
    }
  } catch (error) {
    res.status(500).send('Error')
  }
}
