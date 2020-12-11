const searchIcon = document.getElementById('search-icon')
const searchBar = document.getElementById('search-bar')

searchIcon.onclick = function () {
  //Focus Search Bar (Expand it).
  searchBar.focus()
}

searchBar.onblur = function () {
  //Empty the input content
  this.value = ''
}

searchBar.onkeydown = function (e) {
  // search behavior -> should be handled by algolia
  // if (e.key === 'Enter') alert('Searching for: ' + this.value)
}
