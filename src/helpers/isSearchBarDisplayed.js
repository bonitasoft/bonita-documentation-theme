'use strict'

module.exports = (site, page) => {
  return !(site.keys?.nonProduction || page.attributes?.['hide-search-bar'] || page.layout === '404')
}
