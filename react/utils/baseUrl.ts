import { canUseDOM } from 'vtex.render-runtime'

export const getBaseUrl = () => {
  const protocol = 'https'
  const hostname = canUseDOM
    ? window.location.hostname
    : (global as any).__hostname__

  const rootPath = canUseDOM
    ? window.__RUNTIME__.rootPath
    : (global as any).__RUNTIME__.rootPath

  const baseUrl = `${protocol}://${hostname}${rootPath ?? ''}`

  return baseUrl
}
