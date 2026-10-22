import fs from 'node:fs'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp } from './helpers/appFixture.js'

let app

afterEach(() => {
  app?.remove()
})

// the url()s in the compiled CSS that point at files the app serves from /static/
function staticUrls (css) {
  return [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)]
    .map(match => match[1].split(/[?#]/)[0])
    .filter(url => url.startsWith('/static/'))
}

describe('the compiled styles and the copied assets', () => {
  it('copy.govukAssets provides every file the styles load from /static/', () => {
    // a Flask app that serves application/static/ as /static/
    app = createApp({
      scssPath: './src/scss',
      stylesheetsOutputPath: 'application/static/stylesheets',
      govukOutputPath: 'application/static/'
    })
    app.writeFile('src/scss/application.scss', '@import "digital-land-frontend/dl-frontend";\n')

    app.run('build.stylesheets')
    app.run('copy.govukAssets')

    const css = fs.readFileSync(app.path('application/static/stylesheets/application.css'), 'utf8')
    const urls = staticUrls(css)
    expect(urls).not.toEqual([])

    const missing = urls.filter(url => !fs.existsSync(app.path('application', url)))
    expect(missing).toEqual([])
  })
})
