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
      file: "package/digital-land-frontend/javascripts/vendor/govuk-frontend.js",
    },
    context: "window",
  },
];
