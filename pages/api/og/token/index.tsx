import { Token } from '@reservoir0x/reservoir-kit-ui'
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

const loadFont = (font: string): Promise<ArrayBuffer> =>
  fetch(new URL(`../../../../public/fonts/${font}`, import.meta.url)).then(
    (res) => res.arrayBuffer()
  )

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const base64EncodedToken = searchParams.get('token')

  const [blackFont, regularFont] = await Promise.all([
    loadFont('Inter-Black.ttf'),
    loadFont('Inter-Regular.ttf'),
  ])

  if (!base64EncodedToken) {
    return new ImageResponse(
      <img src={`${process.env.NEXT_PUBLIC_HOST_URL}/og-image.png`} />,
      {
        width: 1200,
        height: 630,
      }
    )
  }

  const token = JSON.parse(atob(base64EncodedToken)) as Token

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: 'white',
          backgroundImage: `url("${process.env.NEXT_PUBLIC_HOST_URL}/og-token.png")`,
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '50px',
            width: '100%',
            maxWidth: '525px',
            height: 'auto',
          }}
        >
          <img
            src={token.token?.imageSmall as string}
            alt={token.token?.name}
            style={{
              width: '450px',
              height: '450px',
              borderRadius: '8px',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '50px',
                  fontWeight: '800',
                }}
              >
                {token.token?.name}
              </p>
            </div>
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '33px',
                  fontFamily: 'Normal',
                }}
              >
                Floor Price
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '5px',
                  fontSize: '38px',
                  fontWeight: '800',
                }}
              >
                <img
                  src="https://explorer.reservoir.tools/icons/currency/no-padding-eth.png"
                  alt="Currency"
                  style={{
                    height: '50px',
                    width: '35px',
                    marginRight: '15px',
                  }}
                />
                {token.market?.floorAsk?.price?.amount?.native}{' '}
                {token.market?.floorAsk?.price?.currency?.symbol?.toUpperCase()}
              </div>
            </div>
            <div
              style={{
                marginTop: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img
                src={token.market?.floorAsk?.source?.icon as string}
                alt="Market Source"
                style={{
                  height: '50px',
                  width: '50px',
                }}
              />
              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '34px',
                  fontWeight: '800',
                }}
              >
                {token.market?.floorAsk?.source?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Black',
          data: blackFont,
          style: 'normal',
        },
        {
          name: 'Regular',
          data: regularFont,
          style: 'normal',
        },
      ],
    }
  )
}
