import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/ActivityTable'
import { useCollectionActivity } from '@reservoir0x/reservoir-kit-ui'

type Props = {
  id: string
}

export const CollectionAcivityTable: FC<Props> = ({ id }) => {
  const data = useCollectionActivity(
    { collection: id, limit: 20 },
    {
      revalidateOnMount: true,
      fallbackData: [],
      revalidateFirstPage: true,
    }
  )

  useEffect(() => {
    data.mutate()
    return () => {
      data.setSize(1)
    }
  }, [])

  return <ActivityTable data={data} />
}
