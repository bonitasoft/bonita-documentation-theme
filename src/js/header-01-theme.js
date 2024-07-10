/* eslint-disable no-undef */
// Need to be on top of the file to avoid the flash after the content loaded
document.querySelector('html').setAttribute('data-theme', isDarkTheme() ? 'dark' : 'light')

// Check if user has set a theme preference in localStorage or in browser preferences
function isDarkTheme () {
  const localThemeSetting = localStorage.getItem('theme')
  return !localThemeSetting
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : localThemeSetting === 'dark'
}

document.addEventListener('DOMContentLoaded', () => {
  function updateTheme (isDarkTheme) {
    // Switch  HighlightJs to theme
    function enableHighLightJsTheme (isDarkTheme) {
      const hljsCssLink = document.getElementById('highlight-style-lnk')
      if (hljsCssLink) {
        const currentHref = hljsCssLink.getAttribute('href')
        let cssHref = currentHref.replace('-dark', '-light')
        if (isDarkTheme) {
          cssHref = currentHref.replace('-light', '-dark')
        }
        hljsCssLink.setAttribute('href', cssHref)
      } else {
        console.log('Failed to find highlight-style-lnk css link element in page, can not swap theme')
      }
    }
    document.querySelector('html').setAttribute('data-theme', isDarkTheme ? 'dark' : 'light')
    enableHighLightJsTheme(isDarkTheme)
  }

  const checkboxTheme = document.getElementById('theme-switch')

  checkboxTheme.addEventListener('change', (event) => {
    const isDarkTheme = event.currentTarget.checked
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')
    updateTheme(isDarkTheme)
  })

  const darkThemeChecked = isDarkTheme()
  updateTheme(darkThemeChecked)
  checkboxTheme.checked = darkThemeChecked
})
