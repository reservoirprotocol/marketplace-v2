import { FC, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LooksRare, Signer } from "@cuonghx.gu-tech/looksrare-sdk"
import { providers } from "ethers";


const createLooksRareSDK = (opts: LooksRareSDKOptions) => {
  return new LooksRare(opts.chainId, opts.provider, opts.signer || undefined)
}


export interface LooksRareSDKOptions {
  chainId: number;
  provider: providers.Provider;
  signer?: Signer | null;
}

export interface LooksRareSDKProviderProps {
  children: ReactNode
  options: LooksRareSDKOptions
}

export const LooksRareSDKContext = createContext<LooksRare|null>(
  null
)

export const LooksRareSDKProvider: FC<LooksRareSDKProviderProps> = ({ children, options }) => {
  const [looksRareSDK, setLooksRareSDK] = useState<LooksRare|null>(null)

  useEffect(() => {
    setLooksRareSDK(createLooksRareSDK(options))
  }, [options])

  return (
    <LooksRareSDKContext.Provider value={looksRareSDK}>
      {children}
    </LooksRareSDKContext.Provider>
  )
}
export const useLooksRareSDK = () => {
  const sdk = useContext(LooksRareSDKContext);
  if (!sdk) {
    throw Error("LooksRareSDK is not initialize!")
  }
  return sdk
}
