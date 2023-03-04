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
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    data,
    isLoading
  };
}
