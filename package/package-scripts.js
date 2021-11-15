const fs = require('fs')

const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

let configPaths = require('./default.paths.json')
const optionalConfigPath = 'digital-land-frontend.config.json'

if (fs.existsSync(optionalConfigPath)) {
  //file exists
  configPaths = {
    ...configPaths,
    ...(readJsonFile(optionalConfigPath))
  }
  console.log(configPaths)
} else {
  console.log("doesn't exist")
}

module.exports = {
  scripts: {
    test: {
      default: `node ${configPaths.digitalLandFrontendPath}index.js`
    },
    build: {
      stylesheets: `node-sass ${configPaths.scssPath} -o ${configPaths.stylesheetsOutputPath} --include-path ${configPaths.govukFrontendPath} --include-path ${configPaths.digitalLandFrontendPath}`
    },
    copy: {
      javascripts: `npx copyfiles "${configPaths.digitalLandFrontendPath}digital-land-frontend/javascripts/**/*.js" ${configPaths.jsOutputPath}`
    }
  }
};
