'use strict'

module.exports = (components, page) => {
  const componentsToHide = page.attributes?.['hide-components']
  if (page.attributes?.['hide-components']) {
    const arrayToHide = trimItems(componentsToHide.split(','))
    const compos = transformAsAnArrayIfNeeded(components)
    return compos.filter((component) => !arrayToHide.includes(component.name))
  }
  return components

  function trimItems (componentsToHide) {
    return componentsToHide.map((c) => c.trim())
  }

  /**
   * Transform the components an array if needed
   * @param components, could be an array of components or
   * an object { component1 : {name: component1}, {name:component2, {...}}}
   * @returns an array of component
   */
  function transformAsAnArrayIfNeeded (components) {
    return Array.isArray(components) ? components : Object.values(components)
  }
}
