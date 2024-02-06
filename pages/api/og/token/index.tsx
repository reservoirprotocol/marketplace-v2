import { ImageResponse } from '@vercel/og'
import { floor } from 'lodash'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const imageUrl = searchParams.get('imageUrl')
  const floorPrice = searchParams.get('floorPrice')

  const tokenId = searchParams.get('tokenId')
  const collection = searchParams.get('collection')

  if (!imageUrl || !tokenId || !collection) {
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
          display: 'flex',
          background: '#18181a',
          width: '100%',
          color: 'white',
          height: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '25',
            left: '25',
          }}
        >
          <img
            height="80"
            width="72"
            src="http://localhost:3000/reservoirLogo.svg"
          />
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            gap: '100px',
            maxWidth: '625px',
            height: '456px',
            alignContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderRadius: '10px',
              backgroundColor: '#27282d',
              padding: '25px',
            }}
          >
            <img
              style={{
                width: '450px',
                height: '100%',
                borderRadius: '8px',
              }}
              src={imageUrl}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              textAlign: 'left',
              width: '100%',
              maxWidth: '350px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                flexBasis: '100%',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <p
                  style={{
                    margin: '0',
                    padding: '0',
                    fontSize: '38px',
                    fontWeight: '800',
                  }}
                >
                  {collection}
                </p>
                <p
                  style={{
                    margin: '0',
                    padding: '0',
                    fontSize: '36px',
                    fontWeight: '800',
                  }}
                >
                  #{tokenId}
                </p>
              </div>
            </div>
            <div
              style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '32px',
                  fontWeight: '500',
                }}
              >
                Floor Price
              </p>
              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '34px',
                  fontWeight: '800',
                }}
              >
                {floorPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
