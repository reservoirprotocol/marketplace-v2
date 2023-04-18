import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactElement,
} from 'react'
import { styled } from '../../stitches.config'
import * as Select from '@radix-ui/react-select'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from './Box'

type Props = {
  children: React.ReactNode
  trigger?: ReactElement<typeof StyledTrigger>
  css?: ComponentPropsWithoutRef<typeof StyledTrigger>['css']
}

type SelectProps = {
  Item: typeof Select.Item
  ItemText: typeof StyledItemText
  Trigger: typeof StyledTrigger
  Value: typeof StyledValue
  DownIcon: typeof SelectDownIcon
}

const StyledTrigger = styled(Select.Trigger, {
  boxSizing: 'border-box',
  borderWidth: 0,
  width: '100%',
  px: '$4',
  py: '$3',
  borderRadius: '$borderRadius',
  fontfamily: '$body',
  fontSize: 16,
  display: 'flex',
  justifyContent: 'space-between',
  color: '$neutralTextContrast',
  backgroundColor: '$inputBackground',
  $$focusColor: '$colors$accentBorderHover',
  '&:placeholder': { color: '$neutralText' },
  '&:focus': { boxShadow: '0 0 0 2px $$focusColor' },
})

const StyledContent = styled(Select.Content, {
  backgroundColor: '$inputBackground',
  color: '$textColor',
  borderRadius: '$borderRadius',
  overflow: 'hidden',
  $$focusColor: '$colors$accentBorderHover',
  boxShadow: '0 0 0 2px $$focusColor',
})

const textCss = {
  color: '$textColor',
  fontFamily: '$body',
  letterSpacing: 0,
}

const StyledItemText = styled(Select.ItemText, textCss)

const StyledValue = styled(Select.Value, textCss)

const SelectDownIcon = forwardRef<
  ElementRef<typeof Select.Icon>,
  ComponentPropsWithoutRef<typeof Select.Icon>
>(({ ...props }, forwardedRef) => (
  <Select.Icon asChild ref={forwardedRef} {...props}>
    <Box css={{ color: '$neutralSolidHover' }}>
      <FontAwesomeIcon icon={faChevronDown} width="14" color="" />
    </Box>
  </Select.Icon>
))

export const RKSelect: React.FC<
  Props &
    ComponentPropsWithoutRef<typeof Select.Root> &
    ComponentPropsWithoutRef<typeof Select.Value>
> &
  SelectProps = ({ children, trigger, css, ...props }) => (
  <Select.Root {...props}>
    {trigger ? (
      trigger
    ) : (
      <StyledTrigger css={{ ...textCss, ...css }}>
        <StyledValue placeholder={props.placeholder}>{props.value}</StyledValue>
        <SelectDownIcon />
      </StyledTrigger>
    )}
    <Select.Portal style={{ zIndex: 1000000 }}>
      <StyledContent>
        <Select.ScrollUpButton />
        <Select.Viewport>{children}</Select.Viewport>
        <Select.ScrollDownButton />
      </StyledContent>
    </Select.Portal>
  </Select.Root>
)

const StyledItem = styled(Select.Item, {
  cursor: 'pointer',
  py: '$3',
  px: '$4',
  color: '$textColor',
  fontFamily: '$body',
  letterSpacing: 0,

  '&:hover': {
    background: '$neutralBgActive',
  },
})

RKSelect.Item = StyledItem
RKSelect.ItemText = StyledItemText
RKSelect.Trigger = StyledTrigger
RKSelect.Value = StyledValue
RKSelect.DownIcon = SelectDownIcon

export default RKSelect
