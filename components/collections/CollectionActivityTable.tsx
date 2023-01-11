import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/common/ActivityTable'
import { useCollectionActivity } from '@reservoir0x/reservoir-kit-ui'

type Props = {
  id: string | undefined
  activityTypes: NonNullable<
    Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
  >['types']
}

export const CollectionAcivityTable: FC<Props> = ({ id, activityTypes }) => {
  const data = useCollectionActivity(
    { collection: id, types: activityTypes, limit: 20 },
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
