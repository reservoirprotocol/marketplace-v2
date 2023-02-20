import { Text } from 'components/primitives'
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

type NavItemProps = {
  active?: boolean
  children: ReactNode
}

const NavItem = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof Text> & NavItemProps
>(({ children, active, css, ...props }, forwardedRef) => (
  <Text
    {...props}
    ref={forwardedRef}
    css={{
      color: active ? '$gray12' : '$gray10',
      cursor: 'pointer',
      '&:hover': {
        color: '$gray11',
      },
      ...css
    }}
    as="p"
    style="subtitle1"
  >
    {children}
  </Text>
))

export default NavItem
