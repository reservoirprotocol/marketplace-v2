const api = async (url: any, data: any = {}) => {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_RESERVOIR_API_BASE}/${url}`,
    {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
        ...(data && data.headers),
      },
      ...data,
    }
  )
  let json = await response.json()

  return json
}

export default api
