import {useAccount} from "wagmi";
import useSWR from "swr";

export default function useQuestEntries() {
  const { address: accountAddress } = useAccount()

  const { data, isLoading } = useSWR(
    `/api/quest?wallet=${accountAddress}`,
    (url: string) => {
      if (!accountAddress) {
        return null
      }
      return fetch(url).then((response) => response.json())
    },
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      refreshInterval: 3_000
    }
  )

  return {
    data,
    isLoading
  };
}
