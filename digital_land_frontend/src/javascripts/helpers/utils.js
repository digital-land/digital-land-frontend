var utils = {}

function camelCaseReplacer (match, s) {
  return s.toUpperCase()
}

utils.curie_to_url_part = function (curie) {
  return curie.replace(':', '/')
}

utils.toCamelCase = function (s) {
  // check to see string isn't already camelCased
  var nonWordChars = /\W/g
  if (s && s.match(nonWordChars)) {
    return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, camelCaseReplacer)
  }
  return s
}

utils.truncate = function (s, len) {
  if (typeof val === 'undefined') {
    console.log("Can't truncate undefined string")
    return ''
  }
  return s.slice(0, len) + '...'
}

/**
 * Create an organisation mapper. Maps organisation ids to names
 * @param  {Array} orgsObj Array of organisation objs. Must contain .id and .name propterties
 */
utils.createOrgMapper = function (orgsObj) {
  const mapper = {}
  orgsObj.forEach(function (o) {
    mapper[o.id] = o.name
  })
  return mapper
}

utils.isFunction = function (x) {
  return Object.prototype.toString.call(x) === '[object Function]'
}

utils.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default utils
