import useSWR from "swr";

export default function useProfile(address: string | undefined) {
    const { data, isLoading } = useSWR(
        `/api/quest/profile?address=${address}`,
        (url: string) => {
            if (!address) {
                return null
            }
            return fetch(url).then((response) => response.json())
        },
        {
            revalidateOnFocus: true,
            revalidateIfStale: true,
            revalidateOnReconnect: true,
        }
    )

    return {
        data,
        isLoading
    };
}