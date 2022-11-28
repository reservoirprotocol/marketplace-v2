import { useTheme } from 'next-themes'
import { Box, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Box>
      {theme == 'dark' && (
        <Button
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          type="button"
          onClick={() => setTheme('light')}
          size="small"
          color="gray3"
        >
          <FontAwesomeIcon icon={faMoon} width={16} height={16} />
        </Button>
      )}
      {theme == 'light' && (
        <Button
          css={{ justifyContent: 'center', width: '44px', height: '44px' }}
          type="button"
          onClick={() => setTheme('dark')}
          size="small"
          color="gray3"
        >
          <FontAwesomeIcon icon={faSun} width={16} height={16} />
        </Button>
      )}
    </Box>
  )
}

export default ThemeSwitcher
