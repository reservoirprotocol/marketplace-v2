import type {NextApiRequest, NextApiResponse} from "next";
import {paths} from "@nftearth/reservoir-sdk";
import fetcher from "utils/fetcher";
import supportedChains from "utils/chains";

// use required instead import because of deprecation
const Web3 = require('web3');

const getAlchemyNetworkName = (chainId: number) => {
  let network;
  if (chainId === 10) {
    network = "opt-mainnet";
  } else if (chainId === 137) {
    network = "polygon";
  } else if (chainId === 42161) {
    network = "arb-mainnet";
  } else {
    throw new Error("Unsupported chain id");
  }

  return network;
};

const getAlchemyAPIKey = (chainId: number) => {
  let apiKey;
  if (chainId === 10) {
    apiKey = process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_ID;
  } else if (chainId === 137) {
    apiKey = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_ID;
  } else if (chainId === 42161) {
    apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_ID;
  } else {
    throw new Error("Unsupported chain id");
  }

  return apiKey;
};


export default async function signature(req: NextApiRequest, res: NextApiResponse) {
  const { id, chain = 10, address } = req.query;
  const web3 = new Web3(`https://${getAlchemyNetworkName(+chain)}.alchemyapi.io/v2/${getAlchemyAPIKey(+chain)}`);
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PKEY as string
  );

  if (!address) {
    return res.send({
      result: null
    });
  }

  try {
    const launchpadQuery: paths["/launchpads/v1"]["get"]["parameters"]["query"] = {
      id: id as string,
      limit: 1
    }

    const marketChain = supportedChains.find(c => c.id === +(chain || 10));

    const { data } = await fetcher(`${marketChain?.reservoirBaseUrl}/launchpads/v1`, launchpadQuery, {
      headers: {
        'x-api-key': marketChain?.apiKey || '',
      },
    })

    const launchpads = data?.launchpad;

    if ((launchpads || []).length > 0 && (launchpads[0].allowlists || [])
      .find((a: string) => a.toLowerCase() === (address as string).toLowerCase())) {
      let message = `0x000000000000000000000000${(address as string).substring(2)}`;
      let {signature} = signer.sign(message);

      return res.send({
        result: signature
      });
    }

    return res.send({
      result: null
    });
  } catch (e) {
    return res.send({
      result: null
    });
  }
}