import { Text } from 'components/primitives'
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

type NavItemProps = {
  active?: boolean
  children: ReactNode
}

const NavItem = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof Text> & NavItemProps
>(({ children, active, ...props }, forwardedRef) => (
  <Text
    {...props}
    ref={forwardedRef}
    css={{
      color: active ? '$gray12' : '$gray12',
      cursor: 'pointer',
      fontWeight: 700,
      '&:hover': {
        color: '$gray11',
      },
    }}
    as="p"
    style="subtitle1"
  >
    {children}
  </Text>
))

export default NavItem
