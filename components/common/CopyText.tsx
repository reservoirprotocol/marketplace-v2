import { Box, Text, Tooltip } from 'components/primitives'
import { FC, ReactNode, useState } from 'react'
import { CSS } from '@stitches/react'
import { useCopyToClipboard } from 'usehooks-ts'

type Props = {
  children: ReactNode
  text: string
  css?: CSS
}

const CopyText: FC<Props> = ({ children, text, css }) => {
  const [value, copy] = useCopyToClipboard()
  const [isCopied, setIsCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCopy = () => {
    copy(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1000)
  }
  return (
    <Tooltip
      sideOffset={0}
      open={open}
      align="center"
      side="top"
      content={
        <Text style="body2" as="p">
          {isCopied ? 'Copied!' : 'Copy'}
        </Text>
      }
    >
      <Box
        onClick={(e) => {
          e.preventDefault()
          handleCopy()
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={() => {
          handleCopy()
          setOpen(true)
          setTimeout(() => setOpen(false), 1000)
        }}
        css={{
          width: '100%',
          cursor: 'pointer',
          height: 'min-content',
          ...css,
        }}
      >
        {children}
      </Box>
    </Tooltip>
  )
}

export default CopyText
