const fs = require('fs')

const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

let configPaths = require('./default.paths.json')
const optionalConfigPath = 'digital-land-frontend.config.json'

if (fs.existsSync(optionalConfigPath)) {
  configPaths = {
    ...configPaths,
    ...(readJsonFile(optionalConfigPath))
  }
}

module.exports = {
  scripts: {
    build: {
      stylesheets: `node-sass ${configPaths.scssPath} -o ${configPaths.stylesheetsOutputPath} --include-path ${configPaths.govukFrontendPath} --include-path ${configPaths.digitalLandFrontendPath}`,
      javascripts: `rollup --config ${configPaths.rollupConfig}`
    },
    copy: {
      javascripts: `npx copyfiles "${configPaths.digitalLandFrontendPath}digital-land-frontend/javascripts/**/*.js" ${configPaths.jsOutputPath} -u 4`,
      json: `npx copyfiles "${configPaths.digitalLandFrontendPath}digital-land-frontend/javascripts/**/*.json" ${configPaths.jsOutputPath} -u 4`
    }
  }
};
