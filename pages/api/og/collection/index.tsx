import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const hasImage = searchParams.has('image')
  const image = hasImage
    ? decodeURIComponent(searchParams.get('image') as string)
    : ''
  const floorPrice = searchParams.get('floorPrice')

  if (!image) {
    return new ImageResponse(
      <img src="https://explorer.reservoir.tools/og-image.png" />,
      {
        width: 1200,
        height: 630,
      }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: '50px',
          color: 'black',
          width: 1200,
          maxWidth: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={image}
          style={{ width: 1200, height: 560, objectFit: 'cover' }}
        />
        <div
          style={{
            width: 1200,
            height: 80,
            background: '#5746AF',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 20,
            color: 'white',
          }}
        >
          Floor Price: {floorPrice}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
