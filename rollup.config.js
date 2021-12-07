module.exports = [
  {
    input: "digital_land_frontend/src/javascripts/digital-land-frontend.js",
    output: {
      file: "package/digital-land-frontend/javascripts/digital-land-frontend.js",
      format: 'umd',
      name: "DLFrontend"
    },
    context: "window",
  },
  {
    input: "node_modules/govuk-frontend/govuk/all.js",
    output: {
      file: "package/digital-land-frontend/javascripts/govuk/govuk-frontend.js",
    },
    context: "window",
  },
  {
    input: "digital_land_frontend/src/javascripts/digital-land-maps.js",
    output: {
      file: "package/digital-land-frontend/javascripts/digital-land-maps.js",
      format: 'umd',
      name: "DLMaps"
    },
    context: "window",
  },
];
