import { useTheme } from 'next-themes'
import { Box, Button, ToggleGroupRoot, ToggleGroupItem } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useMounted } from '../../hooks'
import { useMediaQuery } from 'react-responsive'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const isMounted = useMounted()
  const isMobile = useMediaQuery({ maxWidth: 600 }) && isMounted

  if (isMobile) {
    return (
      <ToggleGroupRoot
        type="single"
        defaultValue={theme}
        css={{
          borderRadius: 0,
        }}
        aria-label="Change theme"
      >
        <ToggleGroupItem
          onClick={() => setTheme('light')}
          value="light"
          disabled={theme == 'light'}
          aria-label="Light Mode"
          css={{
            flex: 0.5,
            p: '$1',
          }}
        >
          <FontAwesomeIcon icon={faSun} width={16} height={16} />
        </ToggleGroupItem>
        <ToggleGroupItem
          onClick={() => setTheme('dark')}
          value="dark"
          disabled={theme == 'dark'}
          aria-label="Dark Mode"
          css={{
            flex: 0.5,
            p: '$1',
          }}
        >
          <FontAwesomeIcon icon={faMoon} width={16} height={16} />
        </ToggleGroupItem>
      </ToggleGroupRoot>
    )
  }

  return (
    <Box>
      <Button
        css={{ justifyContent: 'center', width: '44px', height: '44px' }}
        type="button"
        onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
        size="small"
        color="gray3"
        aria-label="Theme Switcher"
      >
        {theme == 'dark' ? (
          <FontAwesomeIcon icon={faSun} width={16} height={16} />
        ) : (
          <FontAwesomeIcon icon={faMoon} width={16} height={16} />
        )}
      </Button>
    </Box>
  )
}

export default ThemeSwitcher
