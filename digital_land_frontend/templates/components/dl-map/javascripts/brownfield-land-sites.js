/* global L, fetch */
import utils from '../../../../src/javascripts/helpers/utils.js'
import '../../../../src/javascripts/vendor/polyfills/Object/assign'

// set up config variables

let organisationMapper = {}

const popupTemplate =
  '<div class="bfs">' +
    '{hasEndDate}' +
    '<div class="bfs__header">' +
      '<span class="govuk-caption-s">{site}</span>' +
      '<h3 class="govuk-heading-s bfs__addr">{site-address}</h3>' +
      '{ifCoords}' +
    '</div>' +
    '<div class="govuk-grid-row bfs__key-data">' +
      '<dl class="govuk-grid-column-one-half">' +
        '<dt>Hectare</dt>' +
        '<dd>{hectares}</dd>' +
      '</dl>' +
      '<dl class="govuk-grid-column-one-half">' +
        '<dt>Dwellings</dt>' +
        '<dd>{isRange}</dd>' +
      '</dl>' +
    '</div>' +
    '<div class="bfs__meta">' +
      '{orgLink}' +
      '{optionalFields}' +
      '{datesSection}' +
    '</div>' +
    '<div class="bfs__footer">' +
      '<a href="{slug}" class="govuk-link">View complete record</a>' +
    '</div>' +
  '</div>'

const popupOptions = {
  minWidth: '270',
  maxWidth: '270',
  className: 'bfs-popup'
}

const brownfieldSiteStyle = {
  color: '#745729',
  fillColor: '#745729',
  fillOpacity: 0.5
}

const historicalBrownfieldSiteStyle = {
  color: '#d53880 ',
  fillColor: '#f3f2f1',
  fillOpacity: 0.5
}

const potentiallyNullFields = ['deliverable', 'hazardous-substances', 'ownership', 'planning-permission-status', 'planning-permission-type']

// private functions

function ifCoords (data) {
  if (data.latitude && data.longitude) {
    return `<span class="bfs__coords">${data.latitude},${data.longitude}</span>`
  }
  return ''
}

function datesSection (data) {
  return definitionList('Date added', data['start-date'])
}

function definitionList (field, value) {
  return ['<dl>',
    `<dt>${field}</dt>`,
    `<dd>${value}</dd>`,
    '</dl>'].join('\n')
}

function hasEndDate (data) {
  if (data['end-date']) {
    return '<span class="bfs__end-banner">End date: ' + data['end-date'] + '</span>'
  }
  return ''
}

function isRange (data) {
  var str = data['minimum-net-dwellings']
  if (data['minimum-net-dwellings'] != null) {
    if (parseInt(data['minimum-net-dwellings']) !== parseInt(data['maximum-net-dwellings']) || parseInt(data['maximum-net-dwellings']) === 0) {
      str = data['minimum-net-dwellings'] + '-' + data['maximum-net-dwellings']
    }
    return str
  }
  return ''
}

function linkToOrg (data) {
  let orgName = data.organisation
  if (Object.prototype.hasOwnProperty.call(organisationMapper, data.organisation)) {
    orgName = organisationMapper[data.organisation]
  }
  return '<dl>' +
  '<dt>Organisation</dt>' +
  `<dd><a class="govuk-link" href="https://digital-land.github.io/organisation/${utils.curie_to_url_part(data.organisation)}">${orgName}</a></dd>` +
  '</dl>'
}

function optionalFields (data) {
  let extras = ''
  potentiallyNullFields.forEach(function (field) {
    if (data[field]) {
      extras += definitionList(field, data[field])
    }
  })
  return extras
}

function processSiteData (row) {
  const templateFuncs = {
    ifCoords: ifCoords,
    isRange: isRange,
    hasEndDate: hasEndDate,
    datesSection: datesSection,
    orgLink: linkToOrg,
    optionalFields: optionalFields
  }
  return Object.assign(row, templateFuncs)
}

function bindBrownfieldPopup (feature, layer) {
  var popupHTML = createPopup(feature.properties)
  layer
    .bindPopup(popupHTML, popupOptions)
    .on('popupopen', function (e) {
      console.log('Brownfield site selected', e.sourceTarget.feature)
    })
}

function plot (feature, latlng) {
  var style = (feature.properties['end-date']) ? historicalBrownfieldSiteStyle : brownfieldSiteStyle
  var size = siteSize(feature.properties.hectares)
  style.radius = size.toFixed(2)
  return L.circle(latlng, style)
}

// public methods - available on object

function createPopup (row) {
  return L.Util.template(popupTemplate, processSiteData(row))
}

/**
 * Converts brownfield geojson data into points and popups on the map
 * @param  {Object} geojson Set of geojson features
 * @param  {Object} options Options overriding defaults
 *    {Func} .onEachFeature Function to execute on each feature layer created
 */
function brownfieldGeojsonToLayer (geojson, options) {
  return L.geoJSON(geojson, {
    pointToLayer: plot,
    onEachFeature: options.onEachFeature || bindBrownfieldPopup
  })
}

function loadBrownfieldSites (map, url, groupName, options) {
  const groupNameCC = utils.toCamelCase(groupName)
  // check to see if already loaded data
  if (!Object.prototype.hasOwnProperty.call(map.featureGroups, groupNameCC)) {
    fetch(url)
      .then(function (resp) {
        return resp.json()
      })
      .then((data) => {
        var l = map.createFeatureGroup(groupNameCC)
        const geojsonLayer = brownfieldGeojsonToLayer(data, options)
        geojsonLayer.addTo(l)
        if (typeof options.layerGroup !== 'undefined') {
          l.addTo(options.layerGroup)
        }
        // run any callback
        if (options.cb && utils.isFunction(options.cb)) { options.cb(l, groupName) }
      })
      .catch(function (err) {
        console.log('error loading brownfield sites', err)
      })
  }
}

// this feels messy!
function registerMapper (mapper) {
  organisationMapper = mapper
}

function siteSize (hectares) {
  if (isNaN(hectares)) {
    return 100 // give it a default size
  }
  return (Math.sqrt((hectares * 10000) / Math.PI))
}

const brownfieldSites = {
  calcSiteSize: siteSize,
  createPopup: createPopup,
  geojsonToLayer: brownfieldGeojsonToLayer,
  loadSites: loadBrownfieldSites,
  popupOptions: popupOptions,
  popupTemplate: popupTemplate,
  registerOrganisationMapper: registerMapper
}

export default brownfieldSites
