'use strict'

module.exports = (page) => {
  // To keep in sync with the message blocks that are supported (see partials/toolbar.hbs)
  return page.attributes?.['next-release'] ||
    page.attributes?.['custom-message'] ||
    page.attributes?.['out-of-support']
}
