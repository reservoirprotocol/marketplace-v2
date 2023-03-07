import {useAccount} from "wagmi";
import useSWR from "swr";

export default function useQuestExp() {
  const { address } = useAccount()

  const { data, isLoading } = useSWR(
    `/api/quest/exp?address=${address}`,
    (url: string) => {
      if (!address) {
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
