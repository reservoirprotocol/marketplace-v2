import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/common/ActivityTable'
import {useTokenActivity} from '@nftearth/reservoir-kit-ui'
import { paths } from '@nftearth/reservoir-sdk'

type Props = {
  token: paths['/tokens/{token}/activity/v4']['get']['parameters']['path']["token"]
}

export const TokenActivityTable: FC<Props> = ({ token }) => {
  const data = useTokenActivity(
    token,
    {},
    {
      revalidateOnMount: true,
      fallbackData: [],
      revalidateFirstPage: true,
    }
  )

  console.log(data);

  useEffect(() => {
    data.mutate()
    return () => {
      data.setSize(1)
    }
  }, [])

  return <ActivityTable data={data} />
}
