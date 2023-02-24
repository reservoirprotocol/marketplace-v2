import Link from 'next/link'

import { Box, Flex, Text } from '../primitives'
import { FC } from 'react'
import { useTheme } from 'next-themes'
import Carousel from "react-elastic-carousel";
import { items } from './styled/resource.json'

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 700, itemsToShow: 2 },
  { width: 1100, itemsToShow: 3 },
  { width: 1400, itemsToShow: 4 }
];

const LearnCarousel: FC = () => {
  const { theme } = useTheme()
  const { elastic } = items;

  return (
    <Box>
      <Box>
        {/* @ts-ignore */}
        <Carousel breakPoints={breakPoints}>
          {
            elastic.map((item) => (
              <Flex
                direction="column"
                key={item.id}
                css={{
                  // backgroundImage: `url(${item.imageUrl})`
                  backgroundColor: '$blackA7',
                  height: '360px',
                  width: '350px',
                  borderRadius: '5px',
                  padding: '20px 20px',
                }}
              >
                <Box css={{
                  backgroundImage: `url(${item.imageUrl})`,
                  height: '100px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}>
                </Box>
                <Text style={{
                  '@initial': 'h6',
                  '@lg': 'h4',
                }}>
                  {item.title}
                </Text>
                <Text style={{
                    '@initial': 'subtitle2',
                    '@lg': 'subtitle1',
                  }}
                  css={{
                    color: '$green9',
                    textDecoration: 'underline',
                    marginBottom: '30px',
                  }}
                >
                  {item.Links.length} articles
                </Text>
                <Flex direction="column">
                  {
                    item.Links.map((item, index) => <Link href={item.learnLink} key={index}>
                        <Text>&bull; {item.learnTitle}</Text>
                      </Link>
                    )
                  }
                </Flex>
              </Flex>
            ))
          }
        </Carousel>
      </Box>
    </Box>
  )
}

export default LearnCarousel
