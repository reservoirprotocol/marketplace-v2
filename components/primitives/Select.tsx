import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactElement,
} from 'react'
import { styled } from '../../stitches.config'
import * as SelectPrimitive from '@radix-ui/react-select'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from './Box'

type Props = {
  children: React.ReactNode
  trigger?: ReactElement<typeof StyledTrigger>
  css?: ComponentPropsWithoutRef<typeof StyledTrigger>['css']
}

type SelectProps = {
  Item: typeof SelectPrimitive.Item
  ItemText: typeof StyledItemText
  Trigger: typeof StyledTrigger
  Value: typeof StyledValue
  DownIcon: typeof SelectDownIcon
}

const StyledTrigger = styled(SelectPrimitive.Trigger, {
  boxSizing: 'border-box',
  borderWidth: 0,
  width: '100%',
  px: '$4',
  py: '$3',
  borderRadius: 8,
  fontfamily: '$body',
  fontSize: 16,
  display: 'flex',
  justifyContent: 'space-between',
  color: '$neutralTextContrast',
  backgroundColor: '$gray3',
  $$focusColor: '$colors$accentBorderHover',
  '&:placeholder': { color: '$neutralText' },
  '&:focus': { boxShadow: '0 0 0 2px $$focusColor' },
})

const StyledContent = styled(SelectPrimitive.Content, {
  backgroundColor: '$gray3',
  color: '$textColor',
  borderRadius: 8,
  overflow: 'hidden',
  $$focusColor: '$gray4',
  boxShadow: '0 0 0 2px $$focusColor',
})

const textCss = {
  color: '$textColor',
  fontFamily: '$body',
  letterSpacing: 0,
}

const StyledItemText = styled(SelectPrimitive.ItemText, textCss)

const StyledValue = styled(SelectPrimitive.Value, textCss)

const SelectDownIcon = forwardRef<
  ElementRef<typeof SelectPrimitive.Icon>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ ...props }, forwardedRef) => (
  <SelectPrimitive.Icon asChild ref={forwardedRef} {...props}>
    <Box css={{ color: '$neutralSolidHover', ml: '$3' }}>
      <FontAwesomeIcon icon={faChevronDown} width="14" color="" />
    </Box>
  </SelectPrimitive.Icon>
))

export const Select: React.FC<
  Props &
    ComponentPropsWithoutRef<typeof SelectPrimitive.Root> &
    ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
> &
  SelectProps = ({ children, trigger, css, ...props }) => (
  <SelectPrimitive.Root {...props}>
    {trigger ? (
      trigger
    ) : (
      <StyledTrigger css={{ ...textCss, ...css }}>
        <StyledValue placeholder={props.placeholder}>{props.value}</StyledValue>
        <SelectDownIcon />
      </StyledTrigger>
    )}
    <SelectPrimitive.Portal style={{ zIndex: 1000000 }}>
      <StyledContent>
        <SelectPrimitive.ScrollUpButton />
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton />
      </StyledContent>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
)

const StyledItem = styled(SelectPrimitive.Item, {
  cursor: 'pointer',
  py: '$3',
  px: '$4',
  color: '$textColor',
  fontFamily: '$body',
  letterSpacing: 0,

  '&:hover': {
    background: '$gray4',
  },
})

Select.Item = StyledItem
Select.ItemText = StyledItemText
Select.Trigger = StyledTrigger
Select.Value = StyledValue
Select.DownIcon = SelectDownIcon

export default Select
