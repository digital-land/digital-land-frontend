const fs = require('fs')
let scripts = {}

function readJsonFile (filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

// number of folders in a path, used for copyfiles' -u option, which strips that many leading folders from copied files
function pathDepth (path) {
  return path.split('/').filter(folder => folder && folder !== '.').length
}

let configPaths = require('./default.paths.json')
const optionalConfigPath = 'digital-land-frontend.config.json'

if (fs.existsSync(optionalConfigPath)) {
  configPaths = {
    ...configPaths,
    ...readJsonFile(optionalConfigPath)
  }
}

scripts.build = {
  stylesheets: `npx sass ${configPaths.scssPath}:${configPaths.stylesheetsOutputPath} --load-path=${configPaths.govukFrontendPath} --load-path=${configPaths.digitalLandFrontendPath}`,
  javascripts: `npx rollup --config ${configPaths.rollupConfig}`
}

// strip everything above digital-land-frontend/javascripts/ and digital-land-frontend/images/
const digitalLandFrontendDepth = pathDepth(configPaths.digitalLandFrontendPath) + 2
// strip everything above govuk/assets/, so the files end up in <govukOutputPath>/govuk/assets/, which is where the styles look for them
const govukFrontendDepth = pathDepth(configPaths.govukFrontendPath)

scripts.copy = {
  javascripts: `npx copyfiles "${configPaths.digitalLandFrontendPath}digital-land-frontend/javascripts/**/*.{js,json}" ${configPaths.jsOutputPath} -u ${digitalLandFrontendDepth}`,
  images: `npx copyfiles "${configPaths.digitalLandFrontendPath}digital-land-frontend/images/**/*.{png,ico}" ${configPaths.imagesOutputPath} -u ${digitalLandFrontendDepth}`,
  govukAssets: `npx copyfiles -u ${govukFrontendDepth} "${configPaths.govukFrontendPath}govuk/assets/**" ${configPaths.govukOutputPath}`
}

scripts.watch = {
  pages: `npx browser-sync start --proxy ${configPaths.serverURL} --files ${configPaths.templatesPath} ${configPaths.staticFilesPath}`,
  assets: `npx chokidar ${configPaths.watchPaths} -c "npm run nps build.javascripts && npm run nps build.stylesheets"`,
  stylesheets: `npx chokidar ${configPaths.watchPaths} -c "npm run nps build.stylesheets"`,
}

module.exports = { scripts }
