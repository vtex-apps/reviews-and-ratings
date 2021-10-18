import { canUseDOM } from 'vtex.render-runtime'

export const getBaseUrl = () => {
  const protocol = 'https'
  const hostname = canUseDOM ? window.location.hostname : global.__hostname__
  const rootPath = canUseDOM
    ? window.__RUNTIME__.rootPath
    : global.__RUNTIME__.rootPath

  const baseUrl = `${protocol}://${hostname}${rootPath ?? ''}`

  return baseUrl
}
