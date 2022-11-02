'use strict'

// inspired from https://gitlab.com/fedora/docs/docs-website/ui-bundle/-/blob/9f305e302ba1f228f4c23a74d8a01920d39d3795/src/helpers/edit2var.js
module.exports = (editUrl) => {
  if (!editUrl) return false
  return editUrl.replace(/\/edit\//, '/commits/')
}
