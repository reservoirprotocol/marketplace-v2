import { FC, useContext, useEffect } from 'react'
import { ActivityTable } from 'components/common/ActivityTable'
import { useUsersActivity } from '@reservoir0x/reservoir-kit-ui'
import { ChainContext } from 'context/ChainContextProvider'

type ActivityQuery = NonNullable<
  Exclude<Parameters<typeof useUsersActivity>['1'], boolean>
>
type ActivityTypes = Exclude<ActivityQuery['types'], string>

type Props = {
  user: string | undefined
  activityTypes: ActivityTypes
}

export const UserActivityTable: FC<Props> = ({ user, activityTypes }) => {
  let activityQuery: Parameters<typeof useUsersActivity>['1'] = {
    limit: 20,
    types: activityTypes,
  }

  const { chain } = useContext(ChainContext)

  if (chain.collectionSetId) {
    activityQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    activityQuery.community = chain.community
  }

  const data = useUsersActivity(user ? [user] : undefined, activityQuery, {
    revalidateOnMount: true,
    fallbackData: [],
  })

  useEffect(() => {
    data.mutate()
    return () => {
      data.setSize(1)
    }
  }, [])

  return <ActivityTable data={data} />
}
