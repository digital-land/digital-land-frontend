import fs from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, listFiles } from './helpers/appFixture.js'

let app

afterEach(() => {
  app?.remove()
})

describe('copy.govukAssets', () => {
  it('copies the GOV.UK Frontend fonts and images to <govukOutputPath>/govuk/assets/', () => {
    app = createApp()

    app.run('copy.govukAssets')

    const files = listFiles(app.path('assets'))
    expect(files.filter(file => /^govuk\/assets\/fonts\/.+\.woff2$/.test(file))).not.toEqual([])
    expect(files.filter(file => file.startsWith('govuk/assets/images/'))).not.toEqual([])
    expect(files.filter(file => file.startsWith('dist/'))).toEqual([])
  })

  it('works with a govukFrontendPath that has a different number of folders', () => {
    app = createApp({ govukFrontendPath: 'vendor/', govukOutputPath: 'public/' })
    fs.cpSync(path.join(app.path('node_modules/govuk-frontend/dist')), app.path('vendor'), { recursive: true })

    app.run('copy.govukAssets')

    const files = listFiles(app.path('public'))
    expect(files.filter(file => /^govuk\/assets\/fonts\/.+\.woff2$/.test(file))).not.toEqual([])
    expect(files.filter(file => !file.startsWith('govuk/assets/'))).toEqual([])
  })
})

describe('copy.javascripts', () => {
  const expectedFiles = [
    'digital-land-cookies.js',
    'digital-land-frontend.js',
    'digital-land-maps.js',
    'govuk/govuk-frontend.js'
  ]

  it('copies the JavaScript to jsOutputPath', () => {
    app = createApp()

    app.run('copy.javascripts')

    expect(listFiles(app.path('assets/javascripts'))).toEqual(expect.arrayContaining(expectedFiles))
  })

  it('works with a digitalLandFrontendPath that starts with ./', () => {
    app = createApp({
      digitalLandFrontendPath: './node_modules/@digital-land-gov-uk/digital-land-frontend/',
      jsOutputPath: 'public/javascripts'
    })

    app.run('copy.javascripts')

    expect(listFiles(app.path('public/javascripts'))).toEqual(expect.arrayContaining(expectedFiles))
  })
})

describe('copy.images', () => {
  it('copies the images to imagesOutputPath', () => {
    app = createApp()

    app.run('copy.images')

    expect(listFiles(app.path('assets/images'))).toEqual(expect.arrayContaining([
      'dl-apple-touch-icon-180.png',
      'favicon-32.png',
      'favicon.ico'
    ]))
  })
})
