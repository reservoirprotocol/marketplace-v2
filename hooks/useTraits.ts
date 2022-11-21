import useSWR from 'swr'
import api from '../lib/api'

const useTraits = (collection: any) => {
  const params = new URLSearchParams({
    limit: 300,
  } as any)

  const { data, error, isValidating, mutate } = useSWR(
    collection
      ? `collections/${collection}/attributes/explore/v3?${params.toString()}`
      : null,
    api
  )

  return {
    data: data && data.attributes,
    error,
    mutate,
    isLoading: !data && !error,
    isValidating,
  }
}

export default useTraits
