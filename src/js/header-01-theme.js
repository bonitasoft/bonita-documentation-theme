/* eslint-disable no-undef */
function updateHtmlThemeAttribute () {
  const rootHtmlElement = document.querySelector('html')
  rootHtmlElement.setAttribute('data-theme', isDarkTheme() ? 'dark' : 'light')
  rootHtmlElement.setAttribute('data-theme-system', isUsingSystemPreferences())
}

// Switch  HighlightJs to theme
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
  // Required to ensure that the right theme for the 'highlight.js' library is used when the page loads
  enableHighLightJsTheme()
}

// Need to be on top of the file (i.e. run at page initialization) to avoid the flash after the content loaded
updateTheme()
// // Need to be on top of the file (i.e. run at page initialization) to avoid the flash after the content loaded
// updateHtmlThemeAttribute()
// // Required to ensure that the right theme for the 'highlight.js' library is used when the page loads
// enableHighLightJsTheme()

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

// TODO restore system
const themeOrder = ['dark', 'light']
// const themeOrder = ['system', 'dark', 'light']

document.addEventListener('DOMContentLoaded', () => {
  // function updateTheme () {
  //   const bodyClassList = document.querySelector('body').classList;
  //   bodyClassList.add('theme-transition')
  //
  //   updateHtmlThemeAttribute()
  //   enableHighLightJsTheme()
  //
  //   // Remove theme-transition class after transition completes to avoid side effects (for example, when hovering over the left menu)
  //   setTimeout(() => {
  //     bodyClassList.remove('theme-transition')
  //   }, 3000) // TODO must be a little larger than the duration of the transition in CSS
  // }

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

    const bodyClassList = document.querySelector('body').classList;
    bodyClassList.add('theme-transition')

    // updateHtmlThemeAttribute()
    // enableHighLightJsTheme()
    updateTheme()

    // Remove theme-transition class after transition completes to avoid side effects (for example, when hovering over the left menu)
    setTimeout(() => {
      bodyClassList.remove('theme-transition')
    }, 3000) // TODO must be a little larger than the duration of the transition in CSS
  })
})
