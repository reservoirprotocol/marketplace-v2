import type { NextApiRequest, NextApiResponse } from 'next'

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, body, method, headers: reqHeaders } = req;

  const { proposal, token } = body;
  const resp = await fetch("https://lore.xyz/api/proposals", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/json",
      "cookie": "prysmtoken=" + token,
    },
    "body": JSON.stringify(proposal),
    "method": "POST"
  });
  res.json(await resp.json());
}
export default proxy;
