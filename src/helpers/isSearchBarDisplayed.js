'use strict'

module.exports = (site, page) => {
  return page.layout !== '404' &&
    !page.attributes?.['hide-search-bar'] &&
    (site.keys?.forceDisplaySearchBar || !site.keys?.nonProduction)
}
