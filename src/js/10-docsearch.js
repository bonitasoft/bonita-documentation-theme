/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function sendClickEvent (lastQueryID, hits, suggestion) {
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

  aa('clickedObjectIDsAfterSearch', {
    userToken: 'bonitadoc',
    eventName: 'Search suggestion selected',
    index: 'bonitasoft',
    queryID: lastQueryID,
    objectIDs: [objectID],
    positions: [position],
  })
}
