/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function toDarkTheme (resolve) {
  localStorage.setItem('theme', 'dark')
  document.querySelector('html').setAttribute('data-theme', 'dark')

  // Update highlight js theme
  enableHightLightDarkTheme(true)
  // Promise.resolve if existing
  resolve && resolve()
}

function toLightTheme (resolve) {
  localStorage.setItem('theme', 'light')
  document.querySelector('html').setAttribute('data-theme', 'light')

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
