import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/common/ActivityTable'
import { useCollectionActivity, useTokenActivity } from '@reservoir0x/reservoir-kit-ui'

type Props = {
  // id: string | undefined
  id: string;
  activityTypes: NonNullable<
    Exclude<Parameters<typeof useTokenActivity>['1'], boolean>
  >['types']
}

export const TokenActivityTable: FC<Props> = ({ id, activityTypes }) => {
  const data = useTokenActivity(id, {
    types: activityTypes
  },
    {
      revalidateOnMount: true,
      fallbackData: [],
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
