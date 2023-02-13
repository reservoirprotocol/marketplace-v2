import { FC, ReactNode } from 'react'
import { Text, Flex, Box } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

type SettingsProps = {
  tab: string,
  activeTab: string | null,
  children: ReactNode,
  icon: IconProp,
  setActiveTab: () => void
}

const SettingsContentContainer: FC<SettingsProps> = ({ tab, activeTab, setActiveTab, icon, children }) => {
  const isActiveTab = tab === activeTab

  return (
    <Box 
      css={{
        borderBottom: '1px solid $gray7',
        marginBottom: 8,
        padding: '8px 0',
        '@md': {
          borderBottom: 'none',
          marginBottom: 0,
          padding: 0
        }
      }}>
      <Flex
        align="center"
        justify="between"
        css={{ 
          cursor: 'pointer',
          '@md': {
            display: 'none',
          },
        }}
        onClick={setActiveTab}>
        <Flex align='center' css={{ py: 6 }}>
          <FontAwesomeIcon
            icon={icon}
            width={16}
            height={16}
          />
          <Text 
            as="h5" 
            style="subtitle1" 
            css={{
              textTransform: 'capitalize',
              fontWeight: 'bold',
              marginLeft: 8
            }}>
            {tab}
          </Text>
        </Flex>
        <FontAwesomeIcon
          icon={faChevronDown}
          width={16}
          height={16}
          style={{
            transform: isActiveTab ? 'rotate(180deg)' : 'rotate(0)',
            transition: '.3s',
          }}
        />
      </Flex>
      <Box
        css={{
          transition: 'max-height .2s ease-in-out',
          maxHeight: isActiveTab ? 500 : 0,
          overflow: 'auto',
          '@md': {
            padding: '0',
            transition: 'none',
            maxHeight: isActiveTab ? 'calc(100vh - 192px)' : 0
          },
        }}>
        <Box 
          css={{ 
            padding: '8px 0',
            '@md': {
              padding: '0',
            },
          }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default SettingsContentContainer