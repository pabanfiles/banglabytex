export const ORIGIN = 'https://ppmcreator.pages.dev'
export function absUrl(path, origin = ORIGIN) {
  if (!path) return origin
  if (path.startsWith('http')) return path
  return origin.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)
}