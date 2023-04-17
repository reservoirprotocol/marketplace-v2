import React, {
  CSSProperties,
  FC,
  ReactElement,
  SyntheticEvent,
  useContext,
  useState,
  useRef,
  LegacyRef,
  VideoHTMLAttributes,
  AudioHTMLAttributes,
  IframeHTMLAttributes,
} from 'react'
import useModelViewer from '../hooks/useModelViewer'
import MediaPlayButton from './MediaPlayButton'
import { useMeasure } from '@react-hookz/web'
import TokenFallback from './TokenFallback'
import { Token } from 'types/workaround'
import { Box } from 'components/primitives'

type MediaType =
  | 'mp4'
  | 'mp3'
  | 'wav'
  | 'gltf'
  | 'glb'
  | 'png'
  | 'jpeg'
  | 'jpg'
  | 'svg'
  | 'gif'
  | 'html'
  | 'other'
  | undefined

export const extractMediaType = (
  token?: RequiredTokenProps
): MediaType | null => {
  let extension: string | null = null
  if (token?.media) {
    const pieces = token.media.split('/')
    const file =
      pieces && pieces[pieces.length - 1] ? pieces[pieces.length - 1] : null
    const matches = file ? file.match('(\\.[^.]+)$') : null
    extension = matches && matches[0] ? matches[0].replace('.', '') : null
  }
  return (extension as MediaType) ? (extension as MediaType) : null
}

type RequiredTokenProps = Pick<
  NonNullable<Token>,
  'image' | 'media' | 'collection' | 'tokenID'
>

type Props = {
  token?: RequiredTokenProps
  preview?: boolean
  style?: CSSProperties
  className?: string
  modelViewerOptions?: any
  videoOptions?: VideoHTMLAttributes<HTMLVideoElement>
  audioOptions?: AudioHTMLAttributes<HTMLAudioElement>
  iframeOptions?: IframeHTMLAttributes<HTMLIFrameElement>
  fallback?: (mediaType: MediaType | null) => ReactElement | null
  onError?: (e: Event) => void
  onRefreshToken?: () => void
}

const TokenMedia: FC<Props> = ({
  preview,
  token,
  style,
  className,
  modelViewerOptions = {},
  videoOptions = {},
  audioOptions = {},
  iframeOptions = {},
  fallback,
  onError = () => {},
  onRefreshToken = () => {},
}) => {
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null)
  // TO-DO:
  // const themeContext = useContext(ThemeContext)
  // let borderRadius: string = themeContext?.radii?.borderRadius?.value || '0'
  let borderRadius = '0'
  const [error, setError] = useState<SyntheticEvent | Event | null>(null)
  const media = token?.media
  const tokenPreview = token?.image
  const mediaType = extractMediaType(token)
  const defaultStyle: CSSProperties = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius,
    position: 'relative',
  }
  const computedStyle = {
    ...defaultStyle,
    ...style,
  }

  useModelViewer(
    !preview && mediaType && (mediaType === 'gltf' || mediaType === 'glb')
      ? true
      : false
  )

  const [measurements, containerRef] = useMeasure<HTMLDivElement>()
  const isContainerLarge = (measurements?.width || 0) >= 360

  if (!token && !preview) {
    console.warn('A token object or a media url are required!')
    return null
  }

  if (error || (!media && !tokenPreview)) {
    let fallbackElement: ReactElement | null | undefined
    if (fallback) {
      fallbackElement = fallback(mediaType)
    }
    if (!fallbackElement) {
      fallbackElement = (
        <TokenFallback
          style={style}
          className={className}
          token={token}
          onRefreshClicked={onRefreshToken}
        />
      )
    }
    return fallbackElement
  }

  const onErrorCb = (e: SyntheticEvent) => {
    setError(e)
    onError(e.nativeEvent)
  }

  if (preview || !media) {
    return (
      <img
        alt="Token Image"
        src={tokenPreview}
        style={{
          ...computedStyle,
          visibility:
            !tokenPreview || tokenPreview.length === 0 ? 'hidden' : 'visible',
        }}
        className={className}
        onError={onErrorCb}
      />
    )
  }

  // VIDEO
  if (mediaType === 'mp4') {
    return (
      <Box className={className} style={computedStyle} ref={containerRef}>
        {!isContainerLarge && <MediaPlayButton mediaRef={mediaRef} />}
        <video
          style={computedStyle}
          className={className}
          poster={tokenPreview}
          {...videoOptions}
          controls={isContainerLarge}
          loop
          playsInline
          onError={onErrorCb}
          ref={mediaRef as LegacyRef<HTMLVideoElement>}
        >
          <source src={media} type="video/mp4" />
          Your browser does not support the
          <code>video</code> element.
        </video>
      </Box>
    )
  }

  // AUDIO
  if (mediaType === 'wav' || mediaType === 'mp3') {
    return (
      <Box className={className} style={computedStyle} ref={containerRef}>
        {!isContainerLarge && <MediaPlayButton mediaRef={mediaRef} />}
        <img
          alt="Audio Poster"
          src={tokenPreview}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            visibility:
              !tokenPreview || tokenPreview.length === 0 ? 'hidden' : 'visible',
            objectFit: 'cover',
          }}
          onError={onErrorCb}
        />
        <audio
          src={media}
          {...audioOptions}
          onError={onErrorCb}
          ref={mediaRef}
          controls={isContainerLarge}
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            width: 'calc(100% - 32px)',
          }}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </Box>
    )
  }

  // 3D
  if (mediaType === 'gltf' || mediaType === 'glb') {
    return (
      <model-viewer
        src={media}
        ar
        ar-modes="webxr scene-viewer quick-look"
        poster={tokenPreview}
        seamless-poster
        shadow-intensity="1"
        camera-controls
        enable-pan
        {...modelViewerOptions}
        style={computedStyle}
        className={className}
        onError={onErrorCb}
      ></model-viewer>
    )
  }

  //Image
  if (
    mediaType === 'png' ||
    mediaType === 'jpeg' ||
    mediaType === 'jpg' ||
    mediaType === 'gif'
  ) {
    return (
      <img
        alt="Token Image"
        src={media}
        className={className}
        style={{
          ...computedStyle,
          visibility: !media || media.length === 0 ? 'hidden' : 'visible',
        }}
        onError={onErrorCb}
      />
    )
  }

  // HTML
  if (
    mediaType === 'html' ||
    mediaType === null ||
    mediaType === undefined ||
    mediaType === 'other' ||
    mediaType === 'svg'
  ) {
    return (
      <iframe
        style={computedStyle}
        className={className}
        src={media}
        sandbox="allow-scripts"
        frameBorder="0"
        {...iframeOptions}
      ></iframe>
    )
  }

  return (
    <img
      alt="Token Image"
      src={tokenPreview}
      style={{
        ...computedStyle,
        visibility:
          !tokenPreview || tokenPreview.length === 0 ? 'hidden' : 'visible',
      }}
      className={className}
      onError={onErrorCb}
    />
  )
}

export default TokenMedia
