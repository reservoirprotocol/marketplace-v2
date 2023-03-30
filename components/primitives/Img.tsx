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
    props.alt === 'Collection Page Image' ? (
      <Flex
        css={{ ...props.css, background: '$gray1' }}
        justify="center"
        align="center"
      >
        <FontAwesomeIcon
          icon={faImage}
          size="4x"
          width={props.width}
          height={props.height}
        />
      </Flex>
    ) : props.alt === 'Activity Token Image' ? (
      <Flex
        css={{ ...props.css, background: '$gray1' }}
        justify="center"
        align="center"
      >
        <FontAwesomeIcon
          icon={faImage}
          size="2x"
          width={props.width}
          height={props.height}
        />
      </Flex>
    ) : props.alt === 'Searchbar Collection Image' ? (
      <Flex
        css={{ ...props.css, background: '$gray3' }}
        justify="center"
        align="center"
      >
        <FontAwesomeIcon
          icon={faImage}
          size="2x"
          width={props.width}
          height={props.height}
        />
      </Flex>
    ) : (
      <Flex
        css={{ ...props.css, background: '$gray3' }}
        justify="center"
        align="center"
      >
        <FontAwesomeIcon
          icon={faImage}
          width={props.width}
          height={props.height}
        />
      </Flex>
    )
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
