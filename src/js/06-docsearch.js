/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function sendClickEvent (queryID, hits, suggestion) {
  var appID = 'BH4D9OD16A' // The APP ID does not provide any write access, it is used to identify us when using API's
  var apiKey = '16267f96d135c47df8454efd5b448c9a' // Read only API Key

  const Http = new XMLHttpRequest()
  Http.open('POST', 'https://insights.algolia.io/1/events')

  Http.setRequestHeader('x-algolia-api-key', apiKey)
  Http.setRequestHeader('x-algolia-application-id', appID)
  Http.setRequestHeader('Content-Type', 'application/json')

  var position
  var objectID

  for (let i = 0; i < hits.length; i++) {
    var hit = hits[i]
    if (hit.url === suggestion.url) {
      position = i + 1
      objectID = hit.objectID
      break
    }
  }

  // Seems that Gulp uglify is unable to deal with proper js multiline String...
  const body = '{' +
      '"events": [' +
        '{' +
          '"eventType": "click",' +
          '"eventName": "Search suggestion selected",' +
          '"index": "bonitasoft",' +
          '"userToken": "bonitadoc",' +
          '"objectIDs": ["' + objectID + '"],' +
          '"queryID": "' + queryID + '",' +
          '"positions": [' + position + ']' +
        '}' +
      ']' +
    '}'

  Http.send(body)
}
