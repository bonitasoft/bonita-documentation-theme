;(function () {
  // Ajust 'top' css property of sidebar TOC, when message block is present
  const sidebar = document.querySelector('aside.toc.sidebar')
  if (!sidebar) return
  const tocMenu = sidebar.querySelector('div.toc-menu')
  if (!tocMenu) return
  const messageBlock = document.querySelector('div.message-block')
  if (messageBlock) {
    tocMenu.classList.add('top-block_message')
  }
})()
