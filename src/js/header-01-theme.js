/* eslint-disable no-undef */
function updateHtmlThemeAttribute() {
  const rootHtmlElement = document.querySelector('html');
  rootHtmlElement.setAttribute('data-theme', isDarkTheme() ? 'dark' : 'light')
  rootHtmlElement.setAttribute('data-theme-system', isUsingSystemPreferences())
}

// Need to be on top of the file (i.e. run at page initialization) to avoid the flash after the content loaded
updateHtmlThemeAttribute()

// Check if user has set a theme preference in localStorage or in browser preferences
function isDarkTheme () {
  const localThemeSetting = localStorage.getItem('theme')
  return !localThemeSetting
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : localThemeSetting === 'dark'
}

function isUsingSystemPreferences() {
  return !localStorage.getItem('theme')
}

const themeOrder = ['system', 'dark', 'light']
// let currentTheme = null;

document.addEventListener('DOMContentLoaded', () => {
  function updateTheme () {
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

    updateHtmlThemeAttribute()
    enableHighLightJsTheme()
  }

  const themeSwitcher = document.getElementById('theme-switcher')
  themeSwitcher.addEventListener('click', (_event) => {
    console.log('@@click on theme selector')
    console.log('localStorage:', localStorage)
    const currentTheme = isUsingSystemPreferences() ? 'system' : isDarkTheme() ? 'dark' : 'light'
    console.log('computed current theme:', currentTheme)

    const newTheme = themeOrder.indexOf(currentTheme) === themeOrder.length - 1
      ?  themeOrder[0]
      :  themeOrder[themeOrder.indexOf(currentTheme) + 1]
    console.log('New theme:', newTheme)

    // 3 states are managed with a single variable. When theme is undefined, it means that the theme is managed by system preferences
    if(newTheme === 'system') {
      console.log('@@device theme')
      localStorage.removeItem('theme')
      console.log('@@device theme - localStorage:', localStorage)
    } else {
      console.log('@@non device theme')
      localStorage.setItem('theme', newTheme)
    }
    console.log('localStorage:', localStorage)

    updateTheme()
  })

  console.log('@@INIT localStorage:', localStorage)

  // Required to ensure that the right theme for the 'highlight.js' library is used when the page loads
  updateTheme()
})
