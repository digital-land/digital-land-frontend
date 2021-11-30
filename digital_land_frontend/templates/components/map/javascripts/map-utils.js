const circleMarkerStyle = function (hex) {
  return {
    color: hex,
    fillColor: hex,
    fillOpacity: 0.5
  }
}

function setCircleSize (hectares, defaultRadius) {
  if (hectares === null || isNaN(hectares)) {
    return defaultRadius || 100 // give it a default size
  }
  return (Math.sqrt((hectares * 10000) / Math.PI))
}

const mapUtils = {
  circleMarkerStyle: circleMarkerStyle,
  setCircleSize: setCircleSize
}

export default mapUtils
