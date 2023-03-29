import { CSS, styled } from '@stitches/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: '$neutralBg',
  width: 20,
  height: 20,
  minWidth: 20,
  minHeight: 20,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '$gray7',
  '&[data-state=checked]': {
    borderColor: '$primary7',
    backgroundColor: '$primary9',
  },
})

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  color: 'white',
})

const Checkbox = (props?: CheckboxPrimitive.CheckboxProps) => (
  <CheckboxRoot {...props}>
    <CheckboxIndicator>
      <FontAwesomeIcon icon={faCheck} />
    </CheckboxIndicator>
  </CheckboxRoot>
)

export default Checkbox
