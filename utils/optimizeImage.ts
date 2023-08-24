const optimizeImage = (imageHref: string | undefined, width: number) => {
  try {
    if (!imageHref) return ''
    let url = new URL(imageHref)
    const existingWidthRegex = /(w|width)=(\d+)/g
    const existingWidth = imageHref.match(existingWidthRegex)
    if (
      existingWidth &&
      existingWidth[0] &&
      Number(existingWidth[0]) !== width
    ) {
      return imageHref.replace(existingWidthRegex, (match, key, number) => {
        return `${key}=${width}`
      })
    }
    if (url.host === 'lh3.googleusercontent.com') {
      if (imageHref.includes('=s') || imageHref.includes('=w')) {
        let newImage = imageHref.split('=')
        return `${newImage[0]}=w${width}`
      }
      return `${imageHref}=w${width}`
    } else if (url.host === 'i.seadn.io') {
      if (imageHref.includes('w=')) {
        let newImage = imageHref.split('=')
        return `${newImage[0]}=${width}`
      }
      return `${imageHref}?w=${width}`
    } else if (url.host == 'img.seadn.io') {
      if (imageHref.includes('w=')) {
        let newImage = imageHref.split('=')
        return `${newImage[0]}=${width}`
      }
      return `${imageHref.replace(
        'img.seadn.io/files',
        'i.seadn.io/gcs/files'
      )}?w=${width}`
    }
  } catch (e) {
    console.warn('Failed to optimize image', e)
  }
  return imageHref ? imageHref : ''
}
export default optimizeImage
