import { Token } from '@reservoir0x/reservoir-kit-ui'
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import chains from '../../../../utils/chains'

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

  const token = JSON.parse(
    decodeURIComponent(atob(decodeURIComponent(base64EncodedToken)))
  ) as Token

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          height: '100%',
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
            gap: '48px',
            borderRadius: '36px',
            width: '95%',
            height: '90%',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.90)',
            backdropFilter: 'blur(10px)',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <img
              style={{
                borderRadius: '32px',
                height: '530px',
                width: '550px',
              }}
              src={token.token?.image || token.token?.collection?.image}
            />
          </div>
          <div
            style={{
              marginTop: '60px',
              height: '95%',
              width: '43%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
              }}
            >
              <div
                style={{
                  fontSize: '56px',
                  fontFamily: 'Black',
                  fontWeight: '700',
                }}
              >
                {token.token?.collection?.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                  fontFamily: 'Regular',
                  fontSize: '32px',
                }}
              >
                {token.token?.kind?.toUpperCase()}
                {'  '}
                <span style={{ color: '#687076', fontSize: '32px' }}>
                  on
                </span>{' '}
                {
                  chains.find((chain) => chain.id === token.token?.chainId)
                    ?.name
                }
              </div>
            </div>
            <div
              style={{
                marginTop: '50px',
                display: 'flex',
                flexDirection: 'column',
                gap: '50px',
              }}
            >
              {token.market?.floorAsk?.price?.amount?.native && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontFamily: 'Regular',
                    }}
                  >
                    Floor
                  </span>
                  <span
                    style={{
                      fontSize: '40px',
                    }}
                  >
                    {token.market?.floorAsk?.price?.amount?.native} {'  '}
                    {token.market?.floorAsk?.price?.currency?.symbol?.toUpperCase()}
                  </span>
                </div>
              )}
              {token.market?.topBid?.price?.amount?.native && (
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontFamily: 'Regular',
                    }}
                  >
                    Best Offer
                  </span>
                  <span
                    style={{
                      fontSize: '40px',
                    }}
                  >
                    {token.market?.topBid?.price?.amount?.native?.toFixed(2)}
                    {'  '}
                    {token.market?.floorAsk?.price?.currency?.symbol?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: '28px',
                marginTop: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontFamily: 'Regular',
                }}
              >
                {new Date().toLocaleDateString()}
              </div>
              <span
                style={{
                  padding: '24px',
                  borderRadius: '50px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="197"
                  height="40"
                  viewBox="0 0 197 40"
                  fill="none"
                >
                  <path
                    d="M44.3281 10.8103C45.8537 10.7013 47.3793 10.7013 48.9412 10.8103L49.2681 13.8977H49.486C50.0672 11.4641 52.4282 10.447 55.7337 10.447C55.879 11.682 55.879 13.7161 55.7337 14.9511C51.6291 14.9511 50.5031 15.7866 49.5224 18.4018V29.6984C48.2511 29.88 45.5631 29.88 44.3281 29.6984V10.8103Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M74.9119 21.8526C72.4783 22.0342 66.8845 22.0705 63.7607 21.8889V22.797C63.7607 25.3759 65.2499 25.8481 68.3737 25.8481C70.5168 25.8481 72.0424 25.6665 74.0765 25.267C74.2218 26.502 74.2218 28.2455 74.0765 29.4805C71.5339 29.9164 69.4998 30.1343 67.1024 30.1343C61.8718 30.1343 58.5664 28.5724 58.5664 23.9593V16.6946C58.5664 11.8636 62.0535 10.447 66.8845 10.447C71.6792 10.447 74.9119 12.4811 74.9119 17.6754V21.8526ZM69.8267 17.4574C69.8267 14.9874 68.41 14.6969 66.8118 14.6969C65.2136 14.6969 63.7607 14.9874 63.7607 17.4574V18.8741L66.5576 18.6924H69.8267V17.4574Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M92.2033 25.267C92.2033 28.7903 89.4427 30.1343 84.9386 30.1343C83.0135 30.1343 80.7978 29.989 78.7273 29.6258C78.5457 28.3181 78.5457 26.8289 78.7273 25.5576C80.6888 25.8845 82.6503 25.9934 84.1758 25.9934C85.6288 25.9934 87.0091 25.8845 87.0091 24.6495V23.9593C87.0091 22.9059 86.2826 22.7243 85.0476 22.3974L81.7785 21.453C79.7081 20.8718 78.582 19.5642 78.582 17.1669V15.1691C78.582 11.791 81.4879 10.447 86.101 10.447C87.9172 10.447 89.806 10.5923 91.9127 11.0282C92.0943 12.3358 92.0943 13.7888 91.9127 15.0601C89.697 14.6605 88.2804 14.5516 86.6822 14.5516C85.1203 14.5516 83.7763 14.6605 83.7763 15.8955V16.5857C83.7763 17.4938 84.6117 17.8207 85.7377 18.1476L88.7889 18.983C91.041 19.6005 92.2033 20.7265 92.2033 23.4871V25.267Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M112.396 21.8526C109.963 22.0342 104.369 22.0705 101.245 21.8889V22.797C101.245 25.3759 102.734 25.8481 105.858 25.8481C108.001 25.8481 109.527 25.6665 111.561 25.267C111.706 26.502 111.706 28.2455 111.561 29.4805C109.018 29.9164 106.984 30.1343 104.587 30.1343C99.3562 30.1343 96.0508 28.5724 96.0508 23.9593V16.6946C96.0508 11.8636 99.5378 10.447 104.369 10.447C109.164 10.447 112.396 12.4811 112.396 17.6754V21.8526ZM107.311 17.4574C107.311 14.9874 105.894 14.6969 104.296 14.6969C102.698 14.6969 101.245 14.9874 101.245 17.4574V18.8741L104.042 18.6924H107.311V17.4574Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M116.939 10.8103C118.465 10.7013 119.991 10.7013 121.553 10.8103L121.879 13.8977H122.097C122.679 11.4641 125.04 10.447 128.345 10.447C128.49 11.682 128.49 13.7161 128.345 14.9511C124.24 14.9511 123.114 15.7866 122.134 18.4018V29.6984C120.862 29.88 118.174 29.88 116.939 29.6984V10.8103Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M131.834 10.956C133.105 10.7744 135.793 10.7744 137.028 10.956L140.987 24.9405L144.91 10.956C146.145 10.7744 148.724 10.7744 149.959 10.956L144.184 29.6989C142.586 29.8805 139.244 29.8805 137.646 29.6989L131.834 10.956Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M170.042 24.0685C170.042 28.5726 166.628 30.1346 161.543 30.1346C156.457 30.1346 153.043 28.5726 153.043 24.0685V16.5859C153.043 11.9002 156.457 10.4473 161.543 10.4473C166.628 10.4473 170.042 11.9002 170.042 16.5859V24.0685ZM164.848 17.6393C164.848 15.133 163.323 14.8424 161.543 14.8424C159.726 14.8424 158.237 15.133 158.237 17.6393V22.9425C158.237 25.4125 159.726 25.7031 161.543 25.7031C163.323 25.7031 164.848 25.4125 164.848 22.9425V17.6393Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M180.177 8.01341C178.906 8.19503 176.037 8.19503 174.729 8.01341L174.656 3.87254C175.964 3.69092 178.979 3.69092 180.286 3.87254L180.177 8.01341ZM174.874 10.9556C176.109 10.774 178.797 10.774 180.068 10.9556V29.6985C178.797 29.8801 176.109 29.8801 174.874 29.6985V10.9556Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M185.371 10.8105C186.897 10.7015 188.422 10.7015 189.984 10.8105L190.311 13.898H190.529C191.11 11.4643 193.471 10.4473 196.777 10.4473C196.922 11.6823 196.922 13.7164 196.777 14.9514C192.672 14.9514 191.546 15.7868 190.565 18.4021V29.6987C189.294 29.8803 186.606 29.8803 185.371 29.6987V10.8105Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M33.8902 29.7711L16.9453 20.0001V0.439941L33.8902 10.2291V29.7711Z"
                    fill="#80D8FF"
                  />
                  <path
                    d="M0 29.7711L16.9449 20.0001V0.439941L0 10.2291V29.7711Z"
                    fill="#7ACFFF"
                  />
                  <path
                    d="M16.9449 29.771L33.8897 20L16.9449 10.229L0 20L16.9449 29.771Z"
                    fill="url(#paint0_linear_791_252)"
                  />
                  <path
                    opacity="0.3"
                    d="M16.9449 39.5602L0 29.771V10.229L16.9449 20V39.5602Z"
                    fill="#E4F0FE"
                  />
                  <path
                    d="M0 29.771L16.9449 39.5602V29.771L0 20V29.771Z"
                    fill="url(#paint1_linear_791_252)"
                  />
                  <path
                    opacity="0.3"
                    d="M16.9453 39.5602L33.8902 29.771V10.229L16.9453 20V39.5602Z"
                    fill="#D0E6FF"
                  />
                  <path
                    d="M33.8902 29.771L16.9453 39.5602V29.771L33.8902 20V29.771Z"
                    fill="url(#paint2_linear_791_252)"
                  />
                  <path
                    opacity="0.3"
                    d="M16.9449 20.0001L33.8897 10.2291L16.9449 0.439941L0 10.2291L16.9449 20.0001Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_791_252"
                      x1="0.6394"
                      y1="23.6455"
                      x2="33.701"
                      y2="16.2555"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#C132CE" />
                      <stop offset="1" stop-color="#425AFA" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_791_252"
                      x1="6.51876"
                      y1="23.2726"
                      x2="11.3952"
                      y2="39.4928"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#425AFA" />
                      <stop offset="0.16" stop-color="#5A52F2" />
                      <stop offset="0.55" stop-color="#9241DE" />
                      <stop offset="0.84" stop-color="#B436D3" />
                      <stop offset="1" stop-color="#C132CE" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_791_252"
                      x1="19.9438"
                      y1="36.4908"
                      x2="30.7482"
                      y2="23.2364"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#C132CE" />
                      <stop offset="0.1" stop-color="#AB39D6" />
                      <stop offset="0.28" stop-color="#8545E3" />
                      <stop offset="0.47" stop-color="#684EED" />
                      <stop offset="0.65" stop-color="#5355F4" />
                      <stop offset="0.83" stop-color="#4659F9" />
                      <stop offset="1" stop-color="#425AFA" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
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
          weight: 800,
          data: blackFont,
          style: 'normal',
        },
        {
          name: 'Regular',
          weight: 500,
          data: regularFont,
          style: 'normal',
        },
      ],
    }
  )
}
