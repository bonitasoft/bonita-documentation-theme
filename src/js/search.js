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
  //If key name is Enter show alert with current input value
  if (e.key === 'Enter') alert('Searching for: ' + this.value)
}
