import { faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Flex from 'components/primitives/Flex'
import Image from 'next/image'
import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { styled } from 'stitches.config'

const StyledImg = styled(Image)

const defaultLoader = ({ src }: { src: string }) => src

const Img = (props: ComponentPropsWithoutRef<typeof StyledImg>) => {
  const [collectionImageBroken, setCollectionImageBroken] = useState(false)

  useEffect(() => {
    if (collectionImageBroken) {
      setCollectionImageBroken(false)
    }
  }, [props.src])

  return collectionImageBroken || !props.src ? (
    <Flex
      css={{ ...props.css, background: '$gray3' }}
      justify="center"
      align="center"
    >
      <FontAwesomeIcon icon={faImage} width="24" height="24" />
    </Flex>
  ) : (
    <StyledImg
      {...props}
      loader={props.loader || defaultLoader}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setCollectionImageBroken(true)
      }}
    />
  )
}

export default Img
