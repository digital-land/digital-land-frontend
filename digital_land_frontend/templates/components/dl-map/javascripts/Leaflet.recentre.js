/* global L, fetch, window */

L.Control.Recentre = L.Control.extend({
  options: {
    position: 'topleft',
    title: {
      ok: 'Recentre map',
      noLayer: 'No layer provided to recentre on'
    },
    visuallyHiddenClass: 'govuk-visually-hidden'
  },

  onAdd: function (map) {
    const classes = ['leaflet-control-recentre', 'leaflet-bar', 'leaflet-control']
    let title = this.options.title.ok

    if (!this.options.layer) {
      classes.push('leaflet-recentred--no-layer')
      title = this.options.title.noLayer
    }

    var container = L.DomUtil.create('div', classes.join(' '))
    this.link = L.DomUtil.create('a', 'leaflet-control-recentre-button leaflet-bar-part', container)
    this.link.href = '#'
    this.link.title = title
    const btnSpan = L.DomUtil.create('a', this.options.visuallyHiddenClass, this.link)
    btnSpan.textContent = 'Recentre map on primary layer'

    this._map = map

    L.DomEvent.on(this.link, 'click', this._click, this)

    return container
  },

  _click: function (e) {
    L.DomEvent.stopPropagation(e)
    L.DomEvent.preventDefault(e)
    this._map.recentre(this.options)
  }

})

L.Map.include({
  isCentred: function () {
    return this._isCentred || false
  },

  recentre: function (options) {
    if (!this.isCentred()) {
      if (this.hasLayer(options.layer)) {
        this.fitBounds(options.layer.getBounds())
      }
    }
  }
})

L.control.recentre = function (options) {
  return new L.Control.Recentre(options)
}
