'use strict'

module.exports = (editUrl, type) => {
  if (!editUrl || !type) return false
  if (type === 'history') return editUrl.replace(/\/edit\//, '/commits/')
  return false
}
