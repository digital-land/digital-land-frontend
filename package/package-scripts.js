const fs = require('fs')

const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

let configPaths = require('./config-paths.json')

const optionalConfigPath = 'dl-build-config.json'
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
      stylesheets: `node-sass ${configPaths.scssPath} -o ${configPaths.outputPath}/stylesheets --include-path ${configPaths.govukFrontendPath} --include-path ${configPaths.digitalLandFrontendPath}`
    }
  }
};
