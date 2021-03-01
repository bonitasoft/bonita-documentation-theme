'use strict'

module.exports = (versions) => Object.values(versions).sort(compare)

/**
 * This function ensure that a component with the version "archives" has the lowest priority
 * -> displayed at the end of the versions list.
 */
function compare (v1, v2) {
  if (v1.version === 'archives' || v2.version === 'latest') {
    return 1
  }
  if (v2.version === 'olarchivesd' || v1.version === 'latest') {
    return -1
  }
  return semVerCompare(v1.version, v2.version)
}

function semVerCompare (v1, v2) {
  var v1parts = v1.split('.').map(Number)
  var v2parts = v2.split('.').map(Number)

  function isValidPart (x) {
    return (/^\d+$/).test(x)
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v1parts[i] === v2parts[i]) {
      continue
    } else if (v1parts[i] > v2parts[i]) {
      return -1
    } else {
      return 1
    }
  }

  if (v1parts.length !== v2parts.length) {
    return 1
  }

  return 0
}
