import { styled } from 'stitches.config'

export default styled('div', {
  background: '$neutralBgSubtle',
  $$shadowColor: '$colors$panelShadow',
  boxShadow: '0 0px 12px 0px $$shadowColor',
  borderRadius: 8,
})
