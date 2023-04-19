import React, { ComponentPropsWithoutRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Flex from './Flex'
import Text from './Text'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

type Props = {
  message?: string
} & Pick<ComponentPropsWithoutRef<typeof Flex>, 'css'>

export default function ErrorWell({ message, css }: Props) {
  return (
    <Flex
      css={{
        color: '$red11',
        p: '$4',
        gap: '$2',
        background: '$gray3',
        ...css,
      }}
      align="center"
    >
      <FontAwesomeIcon icon={faCircleExclamation} width={16} height={16} />
      <Text style="body3" color="error">
        {message || 'Oops, something went wrong. Please try again.'}
      </Text>
    </Flex>
  )
}
