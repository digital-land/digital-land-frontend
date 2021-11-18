function ZoomControls ($module, leafletMap, initialZoom) {
  this.$module = $module
  this.map = leafletMap
  this.initialZoom = initialZoom
}

ZoomControls.prototype.init = function (params) {
  this.setupOptions(params)

  if (!this.$module) {
    return undefined
  }
  this.$module.classList.remove('js-hidden')

  const $buttons = this.$module.querySelectorAll('.' + this.buttonClass)
  this.$buttons = Array.prototype.slice.call($buttons)

  this.$counter = this.$module.querySelector(this.counterSelector)
  this.$counter.textContent = this.initialZoom

  const boundClickHandler = this.clickHandler.bind(this)
  this.$buttons.forEach(function ($button) {
    $button.addEventListener('click', boundClickHandler)
  })

  const boundZoomHandler = this.zoomHandler.bind(this)
  // use on() not addEventListener()
  this.map.on('zoomend', boundZoomHandler)

  return this
}

ZoomControls.prototype.clickHandler = function (e) {
  e.preventDefault()
  const $clickedEl = e.target
  let $clickedControl = $clickedEl
  // check if button was pressed
  // if contained span then find button
  if (!$clickedEl.classList.contains(this.buttonClass)) {
    $clickedControl = $clickedEl.closest('.' + this.buttonClass)
  }
  this.zoom($clickedControl.dataset.zoomControl)
}

ZoomControls.prototype.zoom = function (direction) {
  (direction === 'in') ? this.map.zoomIn(1) : this.map.zoomOut(1)
}

ZoomControls.prototype.zoomHandler = function (e) {
  const zoomLevel = this.map.getZoom()
  let zl = parseFloat(zoomLevel)
  if (zl % 1 !== 0) {
    zl = parseFloat(zoomLevel).toFixed(2)
  }
  this.$counter.textContent = zl
}

ZoomControls.prototype.setupOptions = function (params) {
  params = params || {}
  this.buttonClass = params.buttonClass || 'zoom-controls__btn'
  this.counterSelector = params.counterSelector || '.zoom-controls__count'
}

export default ZoomControls
