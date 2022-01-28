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
  '--color-admonition-link',
  '--color-link-hover',
  '--color-nav-item',
  '--color-admonition-note',
  '--color-admonition-note-bg',
  '--color-admonition-note-text',
  '--color-admonition-tip',
  '--color-admonition-tip-bg',
  '--color-admonition-tip-text',
  '--color-admonition-important',
  '--color-admonition-important-bg',
  '--color-admonition-important-text',
  '--color-admonition-warning',
  '--color-admonition-warning-bg',
  '--color-admonition-warning-text',
  '--color-admonition-caution',
  '--color-admonition-caution-bg',
  '--color-admonition-caution-text',
  '--color-blue-bright',
  '--color-card-shadow',
  '--color-higlight',
  '--color-higlight-link',
  '--color-footer',
  '--color-card-border',
  '--color-code-background',
  '--color-code-font',
]

var filters = [
  '--filter-icon',
  '--filter-icon-search',
  '--filter-logo-footer',
]

function toDarkTheme (resolve) {
  localStorage.setItem('theme', 'dark')
  colors.forEach(function (color) {
    updateCSSProperty(color, color + '-dark')
  })
  filters.forEach(function (filter) {
    updateCSSProperty(filter, filter + '-dark')
  })

  // Update highlight js theme
  enableHightLightDarkTheme(true)
  // Promise.resolve if existing
  resolve && resolve()
}

function toLightTheme (resolve) {
  localStorage.setItem('theme', 'light')
  colors.forEach(function (color) {
    updateCSSProperty(color, color + '-light')
  })
  filters.forEach(function (filter) {
    updateCSSProperty(filter, filter + '-light')
  })

  // Update highlight js theme
  enableHightLightDarkTheme(false)
  // Promise.resolve if existing
  resolve && resolve()
}

// Update highlight js to dark theme if dark = true
function enableHightLightDarkTheme (dark) {
  var hljsCssLink = document.getElementById('highlight-style-lnk')
  if (hljsCssLink) {
    var currentHref = hljsCssLink.getAttribute('href')
    var cssHref = currentHref.replace('-dark', '-light')
    if (dark) {
      cssHref = currentHref.replace('-light', '-dark')
    }
    hljsCssLink.setAttribute('href', cssHref)
  } else {
    console.log('Failed to find highlight-style-lnk css link element in page, can not swap theme')
  }
}

function performThemeSwitch (checkbox, switchBall) {
  setTimeout(function () {
    const themeSwitchPromise = new Promise((resolve) => {
      if (checkbox.checked) {
        toDarkTheme(resolve)
      } else {
        toLightTheme(resolve)
      }
    })

    themeSwitchPromise.finally(function () {
      switchBall.innerHTML = ''
    })
  }, 100)
}

function updateCSSProperty (propertyToUpdate, propertyValue) {
  document.documentElement.style.setProperty(propertyToUpdate,
    getComputedStyle(document.body).getPropertyValue(propertyValue))
}

// create the loader div
const loader = document.createElement('div')
loader.classList.add('lds-dual-ring')

function toggleDarkThemeMode (checkbox) {
  const switchBall = document.querySelector('.theme-switch-wrapper .toggle-content .label .ball')
  switchBall.appendChild(loader)
  performThemeSwitch(checkbox, switchBall)
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
