const optimizeImage = (imageHref: string | undefined, width: number) => {
  if (!imageHref) return ''
  let url = new URL(imageHref)
  if (url.host === 'lh3.googleusercontent.com') {
    if (imageHref.includes('=s') || imageHref.includes('=w')) {
      let newImage = imageHref.split('=')
      return `${newImage[0]}=w${width}`
    }
    return `${imageHref}=w${width}`
  }
  return imageHref
}
export default optimizeImage
