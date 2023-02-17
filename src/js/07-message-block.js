;(function () {
  // Ajust 'top' css property of sidebar TOC, when message block is present
  var sidebar = document.querySelector('aside.toc.sidebar')
  if (!sidebar) return
  var tocMenu = sidebar.querySelector('div.toc-menu')
  if (!tocMenu) return
  var messageBlock = document.querySelector('div.message-block')
  if (messageBlock) {
    tocMenu.classList.add('top-block_message')
  }
})()
