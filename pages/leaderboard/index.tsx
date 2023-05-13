import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { useTheme } from 'next-themes'
import { LeaderboardTable } from 'components/leaderboard/LeaderboardTable'
import useLeaderboard from "../../hooks/useLeaderboard";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { useMounted } from "../../hooks";

const LeaderboardPage: NextPage = () => {
    const { theme } = useTheme()
    const isMounted = useMounted()
    const loadMoreRef = useRef<HTMLDivElement | null>(null)
    const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
    const {
        data,
        isValidating,
        isFetchingPage,
        fetchNextPage
    } = useLeaderboard({
        limit: 1000
    }, {
        revalidateFirstPage: true,
        revalidateOnFocus: true,
        refreshInterval: 10_000
    })

    useEffect(() => {
        const isVisible = !!loadMoreObserver?.isIntersecting
        if (isVisible) {
            fetchNextPage()
        }
    }, [loadMoreObserver?.isIntersecting, isFetchingPage])

    if (!isMounted) {
        return null
    }

    // return (
    //   <Layout>
    //     <Box
    //       css={{
    //         height: 'calc(100vh - 80px)',
    //         width: '100vw',
    //         '@bp800': {
    //           p: '$6',
    //         },
    //       }}
    //     >
    //       <Flex
    //         align="center"
    //         justify="center"
    //         direction="column"
    //         css={{
    //           height: '100%',
    //           width: '100%',
    //         }}
    //       >
    //         <Text
    //           style={{
    //             '@initial': 'h3',
    //             '@lg': 'h2',
    //           }}
    //           css={{ lineHeight: 1.2, letterSpacing: 2, color: '$gray10' }}
    //         >
    //           MAINTENANCE
    //         </Text>
    //         <Text css={{ color: '$gray10' }}>
    //           This page is under maintenance
    //         </Text>
    //       </Flex>
    //     </Box>
    //   </Layout>
    // )

    return (
        <Layout>
            <Box
                css={{
                    p: 24,
                    width: '100vw',
                    '@bp800': {
                        p: '$6',
                    },
                }}
            >
                <Flex
                    align="center"
                    direction="column"
                    css={{
                        width: '100%',
                        // background: `url(/ClaimRewards.png)`,
                    }}
                >
                    <Text
                        style={{
                            '@initial': 'h3',
                            '@lg': 'h1',
                        }}
                        css={{
                            lineHeight: 1.2,
                            letterSpacing: 2,
                            marginTop: '40px',
                            textAlign: 'center',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            color: theme ? (theme === 'dark' ? 'none' : '$black') : 'none'
                        }}
                    >
                        Aura HUB Leaderboard
                    </Text>

                    <Box css={{ width: '100%' }}>
                        <Flex
                            align="center"
                            direction="column"
                            css={{ textAlign: 'center', gap: '$4' }}
                        >
                        </Flex>
                        <Box css={{ textAlign: 'center' }}>
                            <Text
                                css={{
                                    color: theme
                                        ? theme === 'dark'
                                            ? '#ffffff'
                                            : '$black'
                                        : '#ffffff',
                                    textAlign: 'center',
                                }}
                            >
                                Gain XP by listing on Aura HUB!
                            </Text>
                        </Box>
                    </Box>

                    <Flex
                        align="center"
                        direction="column"
                        css={{
                            width: '100%',
                            alignItems: 'center',
                            marginTop: '50px',
                        }}
                    >
                        <LeaderboardTable data={data.slice(0, 1500)} />
                        <Box ref={loadMoreRef} css={{ height: 20 }} />
                    </Flex>
                </Flex>
            </Box>
        </Layout>
    )
}

export default LeaderboardPage