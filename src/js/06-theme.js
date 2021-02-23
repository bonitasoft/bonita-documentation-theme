/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var colors = [
  '--color-white',
  '--color-text-light',
  '--color-smoke-10',
  '--color-smoke-30',
  '--color-smoke-50',
  '--color-smoke-70',
  '--color-smoke-90',
  '--color-gray-10',
  '--color-gray-30',
  '--color-gray-50',
  '--color-gray-70',
  '--color-jet-20',
  '--color-jet-30',
  '--color-jet-50',
  '--color-jet-70',
  '--color-jet-80',
  '--color-black',
  '--color-blue-bonita',
  '--color-red-bonita',
  '--color-unfocused',
  '--color-focused',
  '--color-link',
  '--color-link-hover',
  '--color-nav-item',
  '--color-admonition-note',
  '--color-admonition-note-bg',
  '--color-admonition-tip',
  '--color-admonition-tip-bg',
  '--color-admonition-important',
  '--color-admonition-important-bg',
  '--color-admonition-warning',
  '--color-admonition-warning-bg',
  '--color-admonition-caution',
  '--color-admonition-caution-bg',
]

var filters = [
  '--filter-icon',
  '--filter-icon-search',
]

function toDarkTheme () {
  localStorage.setItem('theme', 'dark')
  colors.forEach(function (color) {
    updateCSSProperty(color, color + '-dark')
  })
  filters.forEach(function (filter) {
    updateCSSProperty(filter, filter + '-dark')
  })

  // Update highlight js theme
  switchToHighlightDarkTheme(true)
}

function toLightTheme () {
  localStorage.setItem('theme', 'light')
  colors.forEach(function (color) {
    updateCSSProperty(color, color + '-light')
  })
  filters.forEach(function (filter) {
    updateCSSProperty(filter, filter + '-light')
  })

  // Update highlight js theme
  switchToHighlightDarkTheme(false)
}

// Update highlight js to dark theme if dark = true
function switchToHighlightDarkTheme (dark) {
  const hljsCssLink = document.getElementById('highlight-style-lnk')
  if (hljsCssLink) {
    const currentHref = hljsCssLink.getAttribute('href')
    let cssHref = currentHref.replace('-dark', '-light')
    if (dark) {
      cssHref = currentHref.replace('-light', '-dark')
    }
    hljsCssLink.setAttribute('href', cssHref)
  } else {
    console.log('Failed to find highlight-style-lnk css link element in page, can not swap theme')
  }
}

function updateCSSProperty (propertyToUpdate, propertyValue) {
  document.documentElement.style.setProperty(propertyToUpdate,
    getComputedStyle(document.body).getPropertyValue(propertyValue))
}

function toggleDarkThemeMode (checkbox) {
  if (checkbox.checked) {
    toDarkTheme()
  } else {
    toLightTheme()
  }
}

function isDarkTheme () {
  return localStorage.getItem('theme') === 'dark' ? 'checked' : 'unchecked'
}

// init
if (localStorage.getItem('theme') === 'dark') {
  toDarkTheme()
} else {
  toLightTheme()
}
