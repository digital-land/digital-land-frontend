import utils from '../../../../src/javascripts/helpers/utils.js'

/* global L, fetch, window */

// govuk consistent colours
var colours = {
  lightBlue: '#1d70b8',
  darkBlue: '#003078',
  brown: '#594d00',
  yellow_brown: '#a0964e',
  black: '#0b0c0c'
}

const boundaryStyle = {
  fillOpacity: 0.2,
  weight: 2,
  color: colours.darkBlue,
  fillColor: colours.lightBlue
}

const boundaryHoverStyle = {
  fillOpacity: 0.25,
  weight: 2,
  color: colours.black,
  fillColor: colours.darkBlue
}

function Map ($module) {
  this.$module = $module
  this.$wrapper = $module.closest('.dl-map__wrapper')
}

Map.prototype.init = function (params) {
  const _params = params || {}
  // get element id from module
  this.mapId = this.$module.id || 'aMap'
  this.setupOptions(_params)
  this.tiles = this.setTiles()
  this.map = this.createMap()
  this.featureGroups = {}
  this.styles = {
    defaultBoundaryStyle: boundaryStyle,
    defaultBoundaryHoverStyle: boundaryHoverStyle
  }

  if (this.$wrapper) {
    this.$loader = this.$wrapper.querySelector('.dl-map__loader')
  }

  // add fullscreen control
  if (this.options.fullscreenControl) {
    // check fullscreen is available
    if (L.Control.Fullscreen) {
      this.map.addControl(new L.Control.Fullscreen({
        title: {
          false: 'View Fullscreen',
          true: 'Exit Fullscreen'
        }
      }))
    }
  }

  this.geojsonUrls = _params.geojsonURLs || []
  const geojsonOptions = _params.geojsonOptions || {}
  this.geojsonUrls = this.extractURLS()

  // have features been provided
  if (this.geojsonUrls.length || _params.geojsonFeatures) {
    // create a FeatureGroup layer to contain provided features
    // we want to use a FeatureGroup because it has getBounds()
    // FIXME: geojson urls might not be boundaries so fix name
    this.createFeatureGroup('initBoundaries').addTo(this.map)
    this.setupInitialZoomHook(this.featureGroups.initBoundaries)

    // if geojsonFeatures not defined then need to fetch geojson before plotting
    let needToFetchFeatures = true
    let initialFeatures = this.geojsonUrls
    if (typeof _params.geojsonFeatures !== 'undefined') {
      needToFetchFeatures = false
      initialFeatures = _params.geojsonFeatures
    }
    this.plotInitialFeatures(initialFeatures, geojsonOptions, needToFetchFeatures)
  }
  return this
}

Map.prototype.setTiles = function () {
  return L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
}

Map.prototype.addStyle = function (name, style) {
  this.styles[name] = style
}

/**
 * Add event listeners for hovering a layer
 * @param  {Object} layer A leaflet layer (e.g. a polygon)
 * @param  {Object} options Options for configuring hover interaction
 *    {Func} .check Check to decide whether styles+ should be performed
 *    {Object} .defaultStyle Leaflet style object to apply when not hovered
 *    {Object} .hoverStyle Leaflet style object to apply when hovered
 *    {Func} .cb Optional callback to trigger, accepts cb(layer <- leaflet layer, hovered <- boolean)
 */
Map.prototype.addLayerHoverState = function (layer, options) {
  const hasCheck = (options.check && utils.isFunction(options.check))
  const defaultStyle = options.defaultStyle || this.styles.defaultBoundaryStyle
  const hoverStyle = options.hoverStyle || this.styles.defaultBoundaryHoverStyle
  layer.on('mouseover', function () {
    if ((hasCheck) ? options.check(layer) : true) {
      layer.setStyle(hoverStyle)
      if (options.cb && utils.isFunction(options.cb)) { options.cb(layer, true) }
    }
  })
  layer.on('mouseout', function () {
    if ((hasCheck) ? options.check(layer) : true) {
      layer.setStyle(defaultStyle)
      if (options.cb && utils.isFunction(options.cb)) { options.cb(layer, false) }
    }
  })
}

Map.prototype.createMap = function () {
  const opts = this.options
  var latLng = L.latLng(opts.defaultPos[0], opts.defaultPos[1])
  return L.map(this.mapId, {
    center: latLng,
    zoom: opts.default_zoom,
    minZoom: opts.minZoom,
    maxZoom: opts.maxZoom,
    layers: [this.tiles]
  })
}

Map.prototype.createFeatureGroup = function (name, options) {
  const _options = options || {}
  if (Object.prototype.hasOwnProperty.call(this.featureGroups, name)) {
    return this.featureGroups[name]
  }
  const fG = L.featureGroup([], _options)
  this.featureGroups[name] = fG
  return fG
}

function greaterThanViewport (h) {
  return h > window.innerHeight
}

/**
 * Sets the height of the map
 * @param  {Integer} height Height in pixels
 */
Map.prototype.setMapHeight = function (height) {
  const $map = this.$module
  const h = height || (2 / 3)
  const offsetMin = 75
  const minHeight = 300
  const width = $map.offsetWidth
  let v = (h < 1) ? width * h : h

  // limit height to less than viewport to help scrolling
  if (greaterThanViewport(v)) {
    const portion = window.innerHeight * 0.1
    v = window.innerHeight - ((portion < offsetMin) ? offsetMin : portion)
  }

  // but should never be less than minHeight
  $map.style.height = ((v < minHeight) ? minHeight : v) + 'px'
  this.map.invalidateSize()
}

Map.prototype.zoomToLayer = function (layer) {
  this.map.fitBounds(layer.getBounds())
}

/**
 * Extracts URLs from the data-geojson-urls attribute
 * URLs added to the list - duplicates are ignored
 */
Map.prototype.extractURLS = function () {
  var urlsStr = this.$module.dataset.geojsonUrls
  var urlList = this.geojsonUrls

  function isListed (value, arr) {
    return arr.indexOf(value) > -1
  }

  if (typeof urlsStr !== 'undefined') {
    urlsStr.split(';').forEach(function (url) {
      if (!isListed(url, urlList)) {
        urlList.push(url)
      }
    })
  }
  return urlList
}

Map.prototype.hideLoader = function () {
  if (this.$loader) {
    this.$loader.classList.add('js-hidden')
  }
}

Map.prototype.geojsonLayer = function (data, options) {
  const style = options.style || this.styles.defaultBoundaryStyle
  const onEachFeature = options.onEachFeature || function () {}
  return L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature,
    pointToLayer: options.pointToLayer || function (geoJsonPoint, latlng) {
      return L.marker(latlng)
    }
  })
}

Map.prototype.plotInitialFeatures = function (features, options, needToFetchData) {
  const that = this
  const map = this.map
  const defaultFG = this.featureGroups.initBoundaries
  var count = 0

  function addLayer (data) {
    const layer = (utils.isFunction(options.geojsonDataToLayer)) ? options.geojsonDataToLayer(data, options) : that.geojsonLayer(data, options)
    layer.addTo(defaultFG)
    count++
    // check to see if all features have been added
    // only pan map once all boundaries have been added
    if (count === features.length) {
      map.fitBounds(defaultFG.getBounds())
      map.addControl(new L.Control.Recentre({
        layer: defaultFG
      }))
    }
    return layer
  }

  // if needToFetchData is true then features is an array of urls that need to be fetched first
  if (needToFetchData) {
    Promise.allSettled(
      features.map(function (url) {
        return fetch(url)
          .then((response) => {
            return response.json()
          })
          .then((data) => {
            return addLayer(data)
          })
          .catch(function (err) {
            console.log(url, 'error', err)
          })
      })
    ).then(promiseResolutions => {
      // once initial boundaries have loaded execute callback
      if (utils.isFunction(this.options.initGeoJsonLoadCallback)) {
        this.options.initGeoJsonLoadCallback(features, defaultFG)
      }
    })
  } else {
    features.forEach(function (feature) {
      addLayer(feature)
    })
  }
}

Map.prototype.setupInitialZoomHook = function (featureGroup) {
  const that = this
  const map = this.map
  // hook for callback to trigger once inital zoom/fitbounds completes
  if (utils.isFunction(this.options.initZoomCallback)) {
    const moveEndHandler = function (e) {
      console.log('inital map move/zoom handler triggered')
      that.options.initZoomCallback(featureGroup, map)
      map.off('moveend', moveEndHandler)
    }
    map.on('moveend', moveEndHandler)
  }
}

Map.prototype.setupOptions = function (params) {
  params = params || {}
  this.options = {
    defaultPos: params.defaultPos || [52.561928, -1.464854],
    default_zoom: params.minZoom || 6,
    minZoom: params.minZoom || 6,
    maxZoom: params.maxZoom || 18,
    fullscreenControl: params.fullscreenControl || true, // add fullscreen control by default
    initGeoJsonLoadCallback: params.initGeoJsonLoadCallback || undefined,
    initZoomCallback: params.initZoomCallback || undefined
  }
}

export default Map
