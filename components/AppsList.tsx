import React from 'react'
import Box from './primitives/Box'
import Flex from './primitives/Flex'
import Text from './primitives/Text'

const AppBlock = ({ image, logo, description }) => (
  <Flex
    css={{
      borderRadius: 8,
      aspectRatio: '1/1',
      background: '$gray2',
      p: '$4',
      border: '1px solid $gray5',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
    }}
    align="end"
  >
    <Box>
      <img src={logo} style={{ height: 24 }} />

      <Text
        style="body2"
        css={{ color: '$gray12', opacity: 0.8, mt: '$2' }}
        as="p"
      >
        {description}
      </Text>
    </Box>
  </Flex>
)

const AppsList = () => {
  return (
    <Box
      css={{
        display: 'grid',
        gap: '$5',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      }}
    >
      <AppBlock
        image="ensvisioncover.png"
        logo="Ens.png"
        description="Ens Vertical Marketplace. Explore clubs, bulk register, and all things
        ens."
      />

      <AppBlock
        image="ensvisioncover.png"
        logo="Ens.png"
        description="Ens Vertical Marketplace. Explore clubs, bulk register, and all things
        ens."
      />

      <AppBlock
        image="ensvisioncover.png"
        logo="Ens.png"
        description="Ens Vertical Marketplace. Explore clubs, bulk register, and all things
        ens."
      />

      <AppBlock
        image="https://mms.businesswire.com/media/20220504005290/en/1442393/5/Forgotten_Runes_190422_%281%29.jpg"
        logo="Forgotten Runes.png"
        description="Community marketplace for forgotten runes wizards cult. Explore the Runiverse"
      />

      <AppBlock
        image="https://www.sound.xyz/_next/image?url=https%3A%2F%2Fd2i9ybouka0ieh.cloudfront.net%2Fartist-uploads%2F1c922c1b-807f-4ac7-9be6-d280a67a038c%2FRELEASE_COVER_IMAGE%2F7265182-newImage.png&w=2048&q=75"
        logo="soundxyz 1.png"
        description="Top music NFT marketplace. Buy and sell from your favorite artists"
      />
    </Box>
  )
}

export default AppsList
