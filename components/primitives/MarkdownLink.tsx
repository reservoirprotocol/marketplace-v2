import { AnchorStyle } from 'components/primitives/Anchor'
import { AnchorHTMLAttributes } from 'react'
import { styled } from 'stitches.config'

const StyledMarkdownLink = styled('span', AnchorStyle)

export const MarkdownLink = ({ children, href }: AnchorHTMLAttributes<any>) => {
  return (
    <StyledMarkdownLink
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        window.open(href, '_blank')
      }}
    >
      {children}
    </StyledMarkdownLink>
  )
}
