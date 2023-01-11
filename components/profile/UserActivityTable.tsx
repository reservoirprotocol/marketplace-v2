import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/common/ActivityTable'
import { useUsersActivity } from '@reservoir0x/reservoir-kit-ui'
import { COLLECTION_SET_ID, COMMUNITY } from 'pages/_app'

type ActivityQuery = NonNullable<
  Exclude<Parameters<typeof useUsersActivity>['1'], boolean>
>
type ActivityTypes = Exclude<ActivityQuery['types'], string>

type Props = {
  user: string | undefined
  activityTypes: ActivityTypes
}

export const UserActivityTable: FC<Props> = ({ user, activityTypes }) => {
  let useUsersActivityParams: Parameters<typeof useUsersActivity>['1'] = {
    limit: 20,
    types: activityTypes,
  }

  if (COLLECTION_SET_ID) {
    useUsersActivityParams.collectionsSetId = COLLECTION_SET_ID
  } else {
    if (COMMUNITY) useUsersActivityParams.community = COMMUNITY
  }

  const data = useUsersActivity(
    user ? [user] : undefined,
    useUsersActivityParams,
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
