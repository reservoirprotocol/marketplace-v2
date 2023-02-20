import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from "next";
import {paths} from "@nftearth/reservoir-sdk";
import fetcher from "utils/fetcher";
import supportedChains from "utils/chains";

// use required instead import because of deprecation
const Web3 = require('web3');

// First Eligible 1786 Address
import rawSignatures from '../../data/signatures.json';
const web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`);
const signer = web3.eth.accounts.privateKeyToAccount(
  process.env.SIGNER_PKEY as string
);

const signatures: {[key: string]: string} = rawSignatures;

export default async function claim(req: NextApiRequest, res: NextApiResponse) {
  const { address } : { address?: string } = req.query;
  if (!address) {
    return res.send({
      result: null
    });
  }

  if (signatures[address.toLowerCase()]) {
    return signatures[address.toLowerCase()];
  }

  try {
    const listingQuery: paths["/orders/asks/v4"]["get"]["parameters"]["query"] = {
      source: 'nftearth.exchange',
      includePrivate: true,
      maker: address,
      limit: 1
    }

    const promises: ReturnType<typeof fetcher>[] = []
    supportedChains.forEach((chain) => {
      promises.push(
        fetcher(`${chain.reservoirBaseUrl}/orders/asks/v4`, listingQuery, {
          headers: {
            'x-api-key': chain.apiKey || '',
          },
        })
      )
    })

    let results: paths["/orders/asks/v4"]["get"]["responses"]["200"]["schema"]["orders"] = [];
    const responses = await Promise.allSettled(promises)
    responses.forEach((response, i) => {
      if (response.status === 'fulfilled' && response.value.data) {
        results = results?.concat(response.value.data.orders);
      }
    })

    if (results.length > 0) {
      let message = `0x000000000000000000000000${address.substring(2)}`;
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