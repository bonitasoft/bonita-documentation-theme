'use strict'

module.exports = (components, page) => {
  const componentsToHide = page.attributes?.['hide-components']
  if (page.attributes?.['hide-components']) {
    const arrayToHide = trimItems(componentsToHide.split(','))
    return components.filter((component) => !arrayToHide.includes(component.name))
  }
  return components

  function trimItems (componentsToHide) {
    return componentsToHide.map((c) => c.trim())
  }
}
