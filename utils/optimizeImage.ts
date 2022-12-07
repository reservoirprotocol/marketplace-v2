/**
 * If images are stored in Google's servers, optimize
 * their size to reduce load time
 * @param imageHref An image url
 * @param width Desired image width
 * @returns The same image with an additional query param to resize it
 */
 export function optimizeImage(
  imageHref: string | undefined,
  width: number
) {
  if (!imageHref) return ''

  let url = new URL(imageHref)
  // Optimize google images
  if (url.host === 'lh3.googleusercontent.com') {
    if (imageHref.includes('=s') || imageHref.includes('=w')) {
      let newImage = imageHref.split('=')
      return `${newImage[0]}=w${width}`
    }
    return `${imageHref}=w${width}`
  }
  return imageHref
}
