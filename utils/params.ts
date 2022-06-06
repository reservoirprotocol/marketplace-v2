export const paramsToQueryString = (params: {}) => {
  if (!params) {
    return ''
  }

  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&')
}
