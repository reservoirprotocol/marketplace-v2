import {NextApiRequest, NextApiResponse} from "next";
import {ethers} from "ethers";
import artifact from "artifact/NFTELaunchpad.json";
import solidity from "artifact/NFTELaunchpad";

const launchpadVerify = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, id, constructor_args } = req.body;
  const iface = new ethers.utils.Interface(artifact.abi);
  const data: any = {
    apikey: chainId === 42161 ? process.env.ARB_ETHERSCAN_API_KEY : process.env.OPT_ETHERSCAN_API_KEY,
    module: 'contract',
    action: 'verifysourcecode',
    codeformat: 'solidity-single-file',
    compilerversion: 'v0.8.19+commit.7dd6d404',
    contractaddress: id,
    optimizationused: 1,
    runs: 200,
    licenseType: 3,
    contractname: 'NFTELaunchpad',
    sourceCode: solidity,
    constructorArguments: iface.encodeDeploy([constructor_args])
  };

  const formData = new URLSearchParams();
  Object.keys(data).forEach((b: any) => {
    formData.append(b, data[b]);
  })

  const url = new URL(`/api`, chainId === 42161 ? `https://api.arbiscan.io` : `https://api-optimistic.etherscan.io`)

  const response = await fetch(url.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  }).then(res => res.json())
    .catch(e => ({ error: e.message }))

  return res.json(response);
}

export default launchpadVerify;