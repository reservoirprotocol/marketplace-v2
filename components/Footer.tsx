import { FC } from 'react'
import { Box, Text, Flex, Anchor, Button } from './primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'

type SectionTitleProps = {
  title: string
}

const SectionTitle: FC<SectionTitleProps> = ({ title }) => (
  <Text style="subtitle1" css={{ color: '$gray12', mb: 8 }}>
    {title}
  </Text>
)

type SectionLinkProps = {
  name: string
  href: string
}

const SectionLink: FC<SectionLinkProps> = ({ name, href }) => (
  <Anchor
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    weight="medium"
    css={{ fontSize: 14, mt: 16 }}
  >
    {name}
  </Anchor>
)

const developerSectionLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/NFTEarth',
  },
  {
    name: 'API',
    href: 'https://api.nftearth.exchange',
  },
  {
    name: 'Status',
    href: 'https://status.nftearth.exchange/',
  },
]

const resourcesSectionLinks = [
  {
    name: 'Learn About NFTs',
    href: '/learn-nfts',
  },
  {
    name: '$NFTE Token',
    href: 'https://www.coingecko.com/en/coins/nftearth',
  },
  {
    name: 'Brand',
    href: 'https://docs.nftearth.exchange/resources/brand-assets',
  },
]

const companySectionLinks = [
  {
    name: 'Terms',
    href: '/terms',
  },
  {
    name: 'Privacy',
    href: '/privacy',
  },
]

export const Footer = () => {
  return (
    <Flex
      justify="between"
      css={{
        borderTop: '1px solid $gray7',
        borderStyle: 'solid',
        pt: '$5',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 36,
        '@bp600': {
          flexDirection: 'row',
          gap: 0,
        },
      }}
    >
      <Flex css={{ gap: 40, '@bp600': { gap: 136 }, flexWrap: 'wrap' }}>
        <Flex direction="column">
          <Flex direction="column">
            <SectionTitle title="Developers" />
            {developerSectionLinks.map((props) => (
              <SectionLink key={props.name} {...props} />
            ))}
          </Flex>
        </Flex>
        <Flex direction="column">
          <SectionTitle title="Company" />
          {companySectionLinks.map((props) => (
            <SectionLink key={props.name} {...props} />
          ))}
        </Flex>
        <Flex direction="column">
          <Flex direction="column">
            <SectionTitle title="Resources" />
            {resourcesSectionLinks.map((props) => (
              <SectionLink key={props.name} {...props} />
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        css={{ alignItems: 'flex-start', '@bp600': { alignItems: 'flex-end' } }}
      >
        <SectionTitle title="Join the community" />
        <Flex css={{ gap: '$4', mt: 16 }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/NFTEarth_L2"
            aria-label="Twitter"
          >
            <Button
              size="xs"
              color="gray3"
              css={{
                '&:hover': {
                  background: '$gray8',
                },
              }}
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} width={14} height={14} />
            </Button>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/nftearth"
            aria-label="Discord"
          >
            <Button
              size="xs"
              color="gray3"
              css={{
                '&:hover': {
                  background: '$gray8',
                },
              }}
              aria-label="Discord"
            >
              <FontAwesomeIcon icon={faDiscord} width={14} height={14} />
            </Button>
          </a>
        </Flex>
        <Box css={{ marginTop: 10 }}>
          <a href="https://aws.amazon.com/what-is-cloud-computing">
            <img
              height="100"
              width="100"
              src="/images/powered-by-aws-white.png"
              alt="Powered by AWS Cloud Computing"
            />
          </a>
        </Box>
      </Flex>
    </Flex>
  )
}
