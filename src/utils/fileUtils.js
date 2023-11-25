import filenamify from 'filenamify'
import path from 'path'

export function fileName(name) {
  return filenamify(name, { replacement: '-' })
}
function joinPath(base, name) {
  return path.join(base, fileName(name))
}
export { joinPath }
