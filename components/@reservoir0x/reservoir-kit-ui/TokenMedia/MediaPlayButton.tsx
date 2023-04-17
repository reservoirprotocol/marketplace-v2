import React, { FC, useState, useEffect, RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'components/primitives'

type MediaPlayButtonProps = {
  mediaRef: RefObject<HTMLAudioElement> | RefObject<HTMLVideoElement>
}

const MediaPlayButton: FC<MediaPlayButtonProps> = ({ mediaRef }) => {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.onplaying = () => {
        setPlaying(true)
      }
      mediaRef.current.onpause = () => {
        setPlaying(false)
      }
    }
    return () => {
      if (mediaRef.current) {
        mediaRef.current.onplaying = null
        mediaRef.current.onpause = null
      }
    }
  }, [mediaRef])

  return (
    <Button
      css={{
        zIndex: 5,
        position: 'absolute',
        right: 16,
        bottom: 16,
        backdropFilter: 'blur(2px)',
        background: 'rgba(105, 113, 119, 0.5)',
        width: 48,
        height: 48,
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        '&:hover': {
          background: 'rgba(105, 113, 119, 0.7)',
        },
      }}
      onClick={(e: any) => {
        e.preventDefault()
        if (mediaRef.current) {
          if (mediaRef.current.paused) {
            mediaRef.current.play()
          } else {
            mediaRef.current.pause()
          }
        }
      }}
    >
      <FontAwesomeIcon
        icon={playing ? faPause : faPlay}
        width={24}
        height={24}
      />
    </Button>
  )
}

export default MediaPlayButton
