import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const base64EncodedImage = searchParams.get('image')

  if (!base64EncodedImage) {
    return new ImageResponse(
      <img src={`${process.env.NEXT_PUBLIC_HOST_URL}/og-image.png`} />,
      {
        width: 1200,
        height: 630,
      }
    )
  }

  const imageSrc = JSON.parse(atob(base64EncodedImage)) as string

  return new ImageResponse(<img src={imageSrc as string} />, {
    width: 1200,
    height: 630,
  })
}
