;(function () {
  'use strict'

  var SECT_CLASS_RX = /^sect(\d)$/

  var navContainer = document.querySelector('.nav-container')
  var navToggle = document.querySelector('.nav-toggle')

  navToggle.addEventListener('click', showNav)
  // NOTE don't let click events propagate outside of nav container
  navContainer.addEventListener('click', concealEvent)

  var menuPanel = navContainer.querySelector('[data-panel=menu]')
  if (!menuPanel) return
  var nav = navContainer.querySelector('.nav')

  var currentPageItem = menuPanel.querySelector('.is-current-page')
  var originalPageItem = currentPageItem
  if (currentPageItem) {
    activateCurrentPath(currentPageItem)
    scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
  } else {
    menuPanel.scrollTop = 0
  }

  find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
    var li = btn.parentElement
    btn.addEventListener('click', toggleActive.bind(li))
    var navItemSpan = findNextElement(btn, '.nav-text')
    if (navItemSpan) {
      navItemSpan.style.cursor = 'pointer'
      navItemSpan.addEventListener('click', toggleActive.bind(li))
    }
  })

  nav.querySelector('.context').addEventListener('click', function () {
    var currentPanel = nav.querySelector('.is-active[data-panel]')
    var activatePanel = currentPanel.dataset.panel === 'menu' ? 'explore' : 'menu'
    currentPanel.classList.toggle('is-active')
    nav.querySelector('[data-panel=' + activatePanel + ']').classList.toggle('is-active')
  })

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  function onHashChange () {
    var navLink
    var hash = window.location.hash
    if (hash) {
      if (hash.indexOf('%')) hash = decodeURIComponent(hash)
      navLink = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
      if (!navLink) {
        var targetNode = document.getElementById(hash.slice(1))
        if (targetNode) {
          var current = targetNode
          var ceiling = document.querySelector('article.doc')
          while ((current = current.parentNode) && current !== ceiling) {
            var id = current.id
            // NOTE: look for section heading
            if (!id && (id = current.className.match(SECT_CLASS_RX))) id = (current.firstElementChild || {}).id
            if (id && (navLink = menuPanel.querySelector('.nav-link[href="#' + id + '"]'))) break
          }
        }
      }
    }
    var navItem
    if (navLink) {
      navItem = navLink.parentNode
    } else if (originalPageItem) {
      navLink = (navItem = originalPageItem).querySelector('.nav-link')
    } else {
      return
    }
    if (navItem === currentPageItem) return
    find(menuPanel, '.nav-item.is-active').forEach(function (el) {
      el.classList.remove('is-active', 'is-current-path', 'is-current-page')
    })
    navItem.classList.add('is-current-page')
    currentPageItem = navItem
    activateCurrentPath(navItem)
    scrollItemToMidpoint(menuPanel, navLink)
  }

  if (menuPanel.querySelector('.nav-link[href^="#"]')) {
    if (window.location.hash) onHashChange()
    window.addEventListener('hashchange', onHashChange)
  }

  function activateCurrentPath (navItem) {
    var ancestorClasses
    var ancestor = navItem.parentNode
    while (!(ancestorClasses = ancestor.classList).contains('nav-menu')) {
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
        ancestorClasses.add('is-active', 'is-current-path')
      }
      ancestor = ancestor.parentNode
    }
    navItem.classList.add('is-active')
  }

  function toggleActive () {
    this.classList.toggle('is-active')
  }

  function showNav (e) {
    if (navToggle.classList.contains('is-active')) return hideNav(e)
    var html = document.documentElement
    html.classList.add('is-clipped--nav')
    navToggle.classList.add('is-active')
    navContainer.classList.add('is-active')
    html.addEventListener('click', hideNav)
    concealEvent(e)
  }

  function hideNav (e) {
    var html = document.documentElement
    html.classList.remove('is-clipped--nav')
    navToggle.classList.remove('is-active')
    navContainer.classList.remove('is-active')
    html.removeEventListener('click', hideNav)
    concealEvent(e)
  }

  // NOTE don't let event get picked up by window click listener
  function concealEvent (e) {
    e.stopPropagation()
  }

  function scrollItemToMidpoint (panel, el) {
    var rect = panel.getBoundingClientRect()
    var effectiveHeight = rect.height
    var navStyle = window.getComputedStyle(nav)
    if (navStyle.position === 'sticky') effectiveHeight -= rect.top - parseFloat(navStyle.top)
    panel.scrollTop = Math.max(0, (el.getBoundingClientRect().height - effectiveHeight) * 0.5 + el.offsetTop)
  }

  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }

  function findNextElement (from, selector) {
    var el = from.nextElementSibling
    if (!el) return
    return selector ? el[el.matches ? 'matches' : 'msMatchesSelector'](selector) && el : el
  }
})()

function updateCSSProperty (propertyToUpdate, propertyValue) {
  document.documentElement.style.setProperty(propertyToUpdate, getComputedStyle(document.body).getPropertyValue(propertyValue))
}

function toggleDarkThemeMode (checkbox) {
  if (checkbox.checked) {
    updateCSSProperty('--color-white', '--color-white-dark')
    updateCSSProperty('--color-text-light', '--color-text-dark')
    updateCSSProperty('--color-smoke-10', '--color-smoke-10-dark')
    updateCSSProperty('--color-smoke-30', '--color-smoke-30-dark')
    updateCSSProperty('--color-smoke-50', '--color-smoke-50-dark')
    updateCSSProperty('--color-smoke-70', '--color-smoke-70-dark')
    updateCSSProperty('--color-smoke-90', '--color-smoke-90-dark')
    updateCSSProperty('--color-gray-10', '--color-gray-10-dark')
    updateCSSProperty('--color-gray-30', '--color-gray-30-dark')
    updateCSSProperty('--color-gray-50', '--color-gray-50-dark')
    updateCSSProperty('--color-gray-70', '--color-gray-70-dark')
    updateCSSProperty('--color-jet-20', '--color-jet-20-dark')
    updateCSSProperty('--color-jet-30', '--color-jet-30-dark')
    updateCSSProperty('--color-jet-50', '--color-jet-50-dark')
    updateCSSProperty('--color-jet-70', '--color-jet-70-dark')
    updateCSSProperty('--color-jet-80', '--color-jet-80-dark')
    updateCSSProperty('--color-black', '--color-black-dark')
    updateCSSProperty('--color-blue-bonita', '--color-blue-bonita-dark')
    updateCSSProperty('--color-red-bonita', '--color-red-bonita-dark')
    updateCSSProperty('--color-unfocused', '--color-unfocused-dark')
    updateCSSProperty('--color-focused', '--color-focused-dark')
    updateCSSProperty('--color-link', '--color-link-dark')
    updateCSSProperty('--color-link-hover', '--color-link-hover-dark')
  } else {
    updateCSSProperty('--color-white', '--color-white-light')
    updateCSSProperty('--color-text-light', '--color-text-light')
    updateCSSProperty('--color-smoke-10', '--color-smoke-10-light')
    updateCSSProperty('--color-smoke-30', '--color-smoke-30-light')
    updateCSSProperty('--color-smoke-50', '--color-smoke-50-light')
    updateCSSProperty('--color-smoke-70', '--color-smoke-70-light')
    updateCSSProperty('--color-smoke-90', '--color-smoke-90-light')
    updateCSSProperty('--color-gray-10', '--color-gray-10-light')
    updateCSSProperty('--color-gray-30', '--color-gray-30-light')
    updateCSSProperty('--color-gray-50', '--color-gray-50-light')
    updateCSSProperty('--color-gray-70', '--color-gray-70-light')
    updateCSSProperty('--color-jet-20', '--color-jet-20-light')
    updateCSSProperty('--color-jet-30', '--color-jet-30-light')
    updateCSSProperty('--color-jet-50', '--color-jet-50-light')
    updateCSSProperty('--color-jet-70', '--color-jet-70-light')
    updateCSSProperty('--color-jet-80', '--color-jet-80-light')
    updateCSSProperty('--color-black', '--color-black-light')
    updateCSSProperty('--color-blue-bonita', '--color-blue-bonita-light')
    updateCSSProperty('--color-red-bonita', '--color-red-bonita-light')
    updateCSSProperty('--color-unfocused', '--color-unfocused-light')
    updateCSSProperty('--color-focused', '--color-focused-light')
    updateCSSProperty('--color-link', '--color-link-light')
    updateCSSProperty('--color-link-hover', '--color-link-hover-light')
  }
}
