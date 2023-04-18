import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { styled } from '../../stitches.config'
import React, { ComponentPropsWithoutRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'

const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '$neutralText',
})

export default function Loader(
  props: ComponentPropsWithoutRef<typeof LoaderContainer>
) {
  return (
    <LoaderContainer {...props}>
      <motion.div
        initial={{ rotate: 0 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        animate={{ rotate: 360 }}
      >
        <FontAwesomeIcon icon={faSpinner} width={20} height={20} />
      </motion.div>
    </LoaderContainer>
  )
}
