import { Box } from 'components/primitives'
import { FC, useEffect, useRef } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'

const LoadMoreCollections: FC<{ loadMore: () => void }> = ({ loadMore }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible) {
      loadMore()
    }
  }, [loadMoreObserver?.isIntersecting])
  return <Box ref={loadMoreRef} css={{ height: 20, width: '100%' }} />
}

export default LoadMoreCollections
