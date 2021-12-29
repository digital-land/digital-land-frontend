/*
  Converts a nodelist to an array so that array functions
  are available. Such as, forEach.
*/
export function convertNodeListToArray (nl) {
  return Array.prototype.slice.call(nl)
}
