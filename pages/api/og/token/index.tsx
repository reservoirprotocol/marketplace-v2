import { Token } from '@reservoir0x/reservoir-kit-ui'
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const base64EncodedToken = searchParams.get('token')

  const [blackFont, regularFont] = await Promise.all([
    fetch(
      `https://github.com/reservoirprotocol/marketplace-v2/raw/dev/public/fonts/Inter-Black.ttf`
    ).then((res) => res.arrayBuffer()),
    fetch(
      `https://github.com/reservoirprotocol/marketplace-v2/raw/dev/public/fonts/Inter-Regular.ttf`
    ).then((res) => res.arrayBuffer()),
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
          opacity: 0.9,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: 'white',
        }}
      >
        <svg
          style={{
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '-99999',
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 2048 1152"
          fill="none"
        >
          <g clip-path="url(#clip0_1207_77)">
            <rect width="2048" height="1152" fill="black" />
            <g opacity="0.9" filter="url(#filter0_f_1207_77)">
              <rect
                x="-415"
                y="-249.398"
                width="2914"
                height="1639.24"
                fill="url(#paint0_angular_1207_77)"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_1207_77"
              x="-821.983"
              y="-656.382"
              width="3727.97"
              height="2453.21"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="203.492"
                result="effect1_foregroundBlur_1207_77"
              />
            </filter>
            <radialGradient
              id="paint0_angular_1207_77"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(1042 570.221) rotate(107.623) scale(952.739 1693.64)"
            >
              <stop stop-color="#C171FF" />
              <stop offset="0.432292" stop-color="#7000FF" />
              <stop offset="0.65625" stop-color="#80D8FF" />
              <stop offset="1" stop-color="#354FFF" />
            </radialGradient>
            <clipPath id="clip0_1207_77">
              <rect width="2048" height="1152" fill="white" />
            </clipPath>
          </defs>
        </svg>
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
                  fontFamily: 'Regular',
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
                {token.market?.floorAsk?.price?.amount?.native}
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
