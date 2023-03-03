import { useTokenActivity } from '@reservoir0x/reservoir-kit-ui'
import { ActivityTable } from './ActivityTable'
import { FC, useEffect } from 'react'

type Props = {
  // id: string | undefined
  id: string
  activityTypes: NonNullable<
    Exclude<Parameters<typeof useTokenActivity>['1'], boolean>
  >['types']
}

export const TokenActivityTable: FC<Props> = ({ id, activityTypes }) => {
  const data = useTokenActivity(
    id,
    {
      types: activityTypes,
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

  return <ActivityTable source="token" data={data} />
}
