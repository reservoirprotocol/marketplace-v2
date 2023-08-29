const optimizeImage = (imageHref: string | undefined, width: number) => {
  try {
    if (!imageHref) return ''
    let url = new URL(imageHref)
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
    }
  } catch (e) {
    console.warn('Failed to optimize image', e)
  }
  return imageHref ? imageHref : ''
}
export default optimizeImage
