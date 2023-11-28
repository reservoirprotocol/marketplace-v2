import { Text } from 'components/primitives'
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

type NavItemProps = {
  children: ReactNode
}

const NavItem = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof Text> & NavItemProps
>(({ children, ...props }, forwardedRef) => (
  <Text
    {...props}
    ref={forwardedRef}
    css={{
      color: '$gray12',
      cursor: 'pointer',
      fontWeight: 700,
      '&:hover': {
        color: '$gray11',
      },
      ...props.css,
    }}
    as="p"
    style="subtitle1"
  >
    {children}
  </Text>
))

export default NavItem
