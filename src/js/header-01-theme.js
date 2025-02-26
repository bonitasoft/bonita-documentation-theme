/* eslint-disable no-undef */
function updateHtmlThemeAttribute () {
  const rootHtmlElement = document.querySelector('html')
  rootHtmlElement.setAttribute('data-theme', isDarkTheme() ? 'dark' : 'light')
  rootHtmlElement.setAttribute('data-theme-system', isUsingSystemPreferences())
}

// Use the HighlightJs CSS file matching the theme
function enableHighLightJsTheme () {
  const hljsCssLink = document.getElementById('highlight-style-lnk')
  if (hljsCssLink) {
    const currentHref = hljsCssLink.getAttribute('href')
    let cssHref = currentHref.replace('-dark', '-light')
    if (isDarkTheme()) {
      cssHref = currentHref.replace('-light', '-dark')
    }
    hljsCssLink.setAttribute('href', cssHref)
  } else {
    console.log('Failed to find highlight-style-lnk css link element in page, can not swap theme')
  }
}

function updateTheme () {
  updateHtmlThemeAttribute()
  enableHighLightJsTheme()
}

// Ensure that the right theme is used when the page loads
// Must be placed at the head of the page (i.e. executed at page initialization) to avoid flash after content loading
updateTheme()

// Check if user has set a theme preference in localStorage or in browser preferences
function isDarkTheme () {
  const localThemeSetting = localStorage.getItem('theme')
  return !localThemeSetting
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : localThemeSetting === 'dark'
}

function isUsingSystemPreferences () {
  return !localStorage.getItem('theme')
}

const themeOrder = ['system', 'dark', 'light']

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = document.getElementById('theme-switcher')
  themeSwitcher.addEventListener('click', (_event) => {
    function getCurrentTheme () {
      if (isUsingSystemPreferences()) {
        return 'system'
      } else {
        return isDarkTheme() ? 'dark' : 'light'
      }
    }

    const currentTheme = getCurrentTheme()

    const newTheme = themeOrder.indexOf(currentTheme) === themeOrder.length - 1
      ? themeOrder[0]
      : themeOrder[themeOrder.indexOf(currentTheme) + 1]

    // 3 states are managed with a single variable
    // When theme is undefined, it means that the theme is managed by system preferences
    if (newTheme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', newTheme)
    }

    const bodyClassList = document.querySelector('body').classList
    bodyClassList.add('theme-transition')

    updateTheme()
  })
})
