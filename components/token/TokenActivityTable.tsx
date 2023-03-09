import { FC, useEffect } from 'react'
import { ActivityTable } from 'components/common/ActivityTable'
import {useTokenActivity} from '@nftearth/reservoir-kit-ui'
import { paths } from '@nftearth/reservoir-sdk'
import * as Collapsible from "@radix-ui/react-collapsible";
import {Box, CollapsibleContent, Flex, Text} from "../primitives";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownUpAcrossLine} from "@fortawesome/free-solid-svg-icons";
import {NAVBAR_HEIGHT} from "../navbar";
import {useTheme} from "next-themes";

type Props = {
  token: paths['/tokens/{token}/activity/v4']['get']['parameters']['path']["token"]
}

export const TokenActivityTable: FC<Props> = ({ token }) => {
  const { theme } = useTheme()
  const tokenActivity = useTokenActivity(
    token,
    {},
    {
      revalidateOnMount: true,
      fallbackData: [],
      revalidateFirstPage: true,
    }
  )

  useEffect(() => {
    tokenActivity.mutate()
    return () => {
      tokenActivity.setSize(1)
    }
  }, [])

  return (
    <Collapsible.Root
      defaultOpen={true}
      style={{ width: '100%' }}
    >
      <Collapsible.Trigger asChild>
        <Flex
          css={{
            backgroundColor: theme === 'light'
              ? '$primary11'
              : '$primary6',
            px: '$4',
            py: '$3',
            flex: 1,
            cursor: 'pointer',
          }}
          align="center"
        >
          <FontAwesomeIcon icon={faArrowDownUpAcrossLine} />
          <Text style="h6" css={{ ml: '$4' }}>
            Item Activity
          </Text>
        </Flex>
      </Collapsible.Trigger>
      <CollapsibleContent
        css={{
          position: 'sticky',
          top: 16 + 80,
          height: `calc(50vh - ${NAVBAR_HEIGHT}px - 32px)`,
          overflow: 'auto',
          marginBottom: 16,
          borderRadius: '$base',
          p: '$2',
        }}
      >
        <Box
          css={{
            '& > div:first-of-type': {
              pt: 0,
            },
          }}
        >
          <ActivityTable data={tokenActivity} />
        </Box>
      </CollapsibleContent>
    </Collapsible.Root>
  )
}
