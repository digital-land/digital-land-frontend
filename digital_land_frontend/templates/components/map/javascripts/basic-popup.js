/* global L */
import '../../../../src/javascripts/vendor/polyfills/Object/assign'

const popupOptions = {
  minWidth: '270',
  maxWidth: '270',
  className: 'bfs-popup'
}

const popupTemplate =
  '<div class="bfs">' +
    '<div class="bfs__header">' +
      '<span class="govuk-caption-s">{dataType}</span>' +
      '<h3 class="govuk-heading-s bfs__addr">{identifier} - {name}</h3>' +
    '</div>' +
    '<div class="bfs__footer">' +
      '<a href="{slug}" class="govuk-link">View record</a>' +
    '</div>' +
  '</div>'

function processRecord (row, idField) {
  function getId (data) {
    return data[idField]
  }
  const templateFuncs = {
    dataType: () => idField,
    identifier: getId
  }
  return Object.assign(row, templateFuncs)
}

function createPopup (row, idField) {
  return L.Util.template(popupTemplate, processRecord(row, idField))
}

/**
 * Creates an onEachFeature function with understanding of the identifier field
 * @param  {string} id the field name for the record identifier
 */
function initOnEachFeature (id) {
  const identifierField = id || 'slug'

  function onEachFeature (feature, layer) {
    var popupHTML = createPopup(feature.properties, identifierField)
    layer
      .bindPopup(popupHTML, popupOptions)
      .on('popupopen', function (e) {
        console.log('Polygon clicked', e.sourceTarget.feature)
      })
  }
  return onEachFeature
}

const basicPopup = {
  initOnEachFeature: initOnEachFeature
}

export default basicPopup
