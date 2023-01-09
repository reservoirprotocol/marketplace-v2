import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/ActivityTable'
import { useUsersActivity } from '@reservoir0x/reservoir-kit-ui'

type ActivityQuery = NonNullable<
  Exclude<Parameters<typeof useUsersActivity>['1'], boolean>
>
type ActivityTypes = Exclude<ActivityQuery['types'], string>

type Props = {
  user: string | undefined
  activityTypes: ActivityTypes
}

export const UserActivityTable: FC<Props> = ({ user, activityTypes }) => {
  const data = useUsersActivity(
    user ? [user] : undefined,
    { types: activityTypes, limit: 20 },
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
