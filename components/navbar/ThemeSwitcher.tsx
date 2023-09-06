import { useTheme } from 'next-themes'
import { Flex } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import { ToggleGroup, ToggleGroupItem } from '../primitives/ToggleGroup'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Flex>
      <ToggleGroup
        type="single"
        defaultValue="light"
        value={theme}
        css={{ width: '100%' }}
      >
        <ToggleGroupItem
          className="ToggleGroupItem"
          value="light"
          aria-label="Left aligned"
          css={{ flex: 1, width: 82 }}
          onClick={() => setTheme('light')}
        >
          <FontAwesomeIcon icon={faSun} width={16} height={16} />
        </ToggleGroupItem>

        <ToggleGroupItem
          className="ToggleGroupItem"
          value="dark"
          aria-label="Left aligned"
          css={{ flex: 1, width: 82 }}
          onClick={() => setTheme('dark')}
        >
          <FontAwesomeIcon icon={faMoon} width={16} height={16} />
        </ToggleGroupItem>
      </ToggleGroup>
    </Flex>
  )
}

export default ThemeSwitcher
