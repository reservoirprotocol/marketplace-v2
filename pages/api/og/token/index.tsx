import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const username = searchParams.get('username')
  if (!username) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    })
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#FFFFFF',
          width: '100%',
          height: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            gap: '100px',
            maxWidth: '650px',
            height: '456px',
            alignContent: 'center',
          }}
        >
          <img
            style={{
              width: '450px',
              height: '100%',
            }}
            src="https://img.reservoir.tools/images/v2/mainnet/7%2FrdF%2Fe%2F0iXY8HduhRCoIehkmFeXPeOQQFbbmIPfjCbCXKLsuDt18p3OulhLKv8TKaZCI41o2WCoOirix6cHssQr5TqH0O8S4M3MynFOJRr7Hi1wjgLGu8azbkPk7vuTma41f4HVr6Z8EEGAJwY7KVAbKelk1p6F59czib0n2lU%3D.png?width=512"
          />
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
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Bored Ape Yacht Club
                </p>
                <p
                  style={{
                    margin: '0',
                    padding: '0',
                    fontSize: '24px',
                    fontWeight: '800',
                  }}
                >
                  #1234
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
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Floor Price
              </p>
              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '28px',
                  fontWeight: '800',
                }}
              >
                24.488
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
