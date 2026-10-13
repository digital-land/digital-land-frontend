# Digital Land Frontend

Shared Jinja templates, components, Sass and JavaScript for Digital Land and planning.data.gov.uk services. It's built on the [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) and adds the components and layouts that our services share.

It's published as two packages, which you use together:

| Package | Install from | Contains |
|---|---|---|
| `digital-land-frontend` | [PyPI](https://pypi.org/project/digital-land-frontend/) | Jinja layouts, partials and component macros, and Jinja filters |
| `@digital-land-gov-uk/digital-land-frontend` | [npm](https://www.npmjs.com/package/@digital-land-gov-uk/digital-land-frontend) | Sass, compiled JavaScript, images, and build scripts |

**Always use the same version of both packages.** They're released together, and each version's templates go with that version's Sass and JavaScript.

* [Changelog](https://github.com/digital-land/digital-land-frontend/blob/main/CHANGELOG.md): what changed in each version
* [Releases](https://github.com/digital-land/digital-land-frontend/releases)
* [Source code and issues](https://github.com/digital-land/digital-land-frontend)

## Contents

* [Installation](#installation)
* [General use](#general-use)
* [Use with Flask](#use-with-flask)
* [Migrating from versions before 0.8.0](#migrating-from-versions-before-080)

## Installation

Install both packages at the same version. Replace `X.Y.Z` with the [latest version](https://github.com/digital-land/digital-land-frontend/releases).

Python, for example in `requirements.in`:

```
digital-land-frontend==X.Y.Z
```

npm:

```
npm install @digital-land-gov-uk/digital-land-frontend@X.Y.Z
```

The packages are built against GOV.UK Frontend 5.11.1. The npm package installs that version of `govuk-frontend`. The Python package uses [govuk-frontend-jinja](https://pypi.org/project/govuk-frontend-jinja/) for the GOV.UK templates, so pin it to 3.7.x, the version that matches GOV.UK Frontend 5.11.1.

## General use

### Templates

Make the templates available to Jinja with a `PrefixLoader`, so they can be loaded as `digital-land-frontend/...`. The GOV.UK templates they build on are loaded as `govuk_frontend_jinja/...`:

```python
from jinja2 import ChoiceLoader, PackageLoader, PrefixLoader

loader = ChoiceLoader(
    [
        your_existing_loader,
        PrefixLoader(
            {
                "govuk_frontend_jinja": PackageLoader("govuk_frontend_jinja"),
                "digital-land-frontend": PackageLoader("digital_land_frontend"),
            }
        ),
    ]
)
```

Extend a layout:

```jinja
{% extends "digital-land-frontend/layouts/base.jinja" %}
```

There are two layouts: `layouts/base.jinja` and `layouts/base--full-width.jinja`.

Import a component macro:

```jinja
{% from "digital-land-frontend/components/data-record/macro.jinja" import dlDataRecordPanel %}
```

| Component | Macro |
|---|---|
| `back-to-top` | `backToTop` |
| `data-item` | `dlDataItem` |
| `data-record` | `dlDataRecordPanel` |
| `data-reference-cell` | `dlDataReferenceCell` |
| `data-table` | `dlDataTableWrapper` |
| `feedback` | `dlFeedback` |
| `filter-checkboxes` | `dlFilterCheckboxes` |
| `filter-group` | `dlFilterGroup` |
| `header-bar` | `dlHeaderBar` |
| `hero` | `dlHero` |
| `map` | `dlMap`, `dlLeafletMap` |
| `phase-banner` | `dlPhaseBanner` |
| `sub-nav-tabs` | `dlSubNavTabs` |

The layouts link to assets under `assetPath`, which defaults to `/assets`. Set `assetPath` in your template context if you serve them from somewhere else.

### Filters and globals

The Python package includes Jinja filters in `digital_land_frontend.filters` and a global in `digital_land_frontend.globals`. Register the ones you use.

The map component needs the `is_list` filter and the `random_int` global, registered with exactly those names:

```python
from digital_land_frontend.filters import is_list_filter
from digital_land_frontend.globals import random_int

env.filters["is_list"] = is_list_filter
env.globals["random_int"] = random_int
```

| Function | Suggested name | What it does |
|---|---|---|
| `is_list_filter` | `is_list` | checks if a value is a list |
| `is_valid_uri_filter` | `is_valid_uri` | checks if a string is a valid URL |
| `make_link_filter` | `make_link` | turns a URL into a link, if it's a valid URL |
| `float_to_int_filter` | `float_to_int` | converts a float to an integer |
| `commanum_filter` | `commanum` | formats a number with thousands separators |
| `split_to_list_filter` | `split_to_list` | splits a string into a list, on `;` by default |
| `readable_date_filter` | `readable_date` | formats a date, for example 01 January 2025 |
| `hex_to_rgb_string_filter` | `hex_to_rgb_string` | converts a hex colour to an RGB string |
| `random_int` (global) | `random_int` | returns a random string of digits, used for unique IDs |

### Build scripts

The npm package includes build scripts, run with [nps](https://www.npmjs.com/package/nps). Add this to `scripts` in your `package.json`:

```json
"nps": "nps -c ./node_modules/@digital-land-gov-uk/digital-land-frontend/package-scripts.js"
```

Then run them with `npm run nps <script>`:

| Script | What it does |
|---|---|
| `build.stylesheets` | compiles your Sass, with the GOV.UK Frontend and Digital Land Frontend Sass available to import |
| `build.javascripts` | compiles your JavaScript with rollup, using your `rollup.config.js` |
| `copy.javascripts` | copies the Digital Land Frontend JavaScript into your project |
| `copy.images` | copies the Digital Land Frontend images into your project |
| `copy.govukAssets` | copies the GOV.UK Frontend fonts and images into your project |
| `watch.pages` | reloads the browser when templates or static files change, using browser-sync |
| `watch.assets` | rebuilds JavaScript and stylesheets when your source files change |
| `watch.stylesheets` | rebuilds stylesheets when your source files change |

### Configuration

To change where the scripts read from and write to, create a `digital-land-frontend.config.json` file in your project root. Anything you set overrides the defaults:

| Option | Default |
|---|---|
| `scssPath` | `./src/scss` |
| `stylesheetsOutputPath` | `assets/stylesheets` |
| `jsOutputPath` | `assets/javascripts` |
| `imagesOutputPath` | `assets/images` |
| `govukOutputPath` | `assets/` |
| `rollupConfig` | `./rollup.config.js` |
| `watchPaths` | `'./src/scss/**/*.scss' './src/javascripts/**/*.js'` |
| `templatesPath` | `'application/templates'` |
| `staticFilesPath` | `'application/static'` |
| `serverURL` | `http://localhost:5000` |
| `digitalLandFrontendPath` | `node_modules/@digital-land-gov-uk/digital-land-frontend/` |
| `govukFrontendPath` | `node_modules/govuk-frontend/dist/` |

For example:

```json
{
  "scssPath": "./assets/scss",
  "stylesheetsOutputPath": "application/static/stylesheets",
  "jsOutputPath": "application/static/javascripts"
}
```

### Sass

In your main Sass file, import Digital Land Frontend. This also imports what it needs from GOV.UK Frontend:

```scss
@import "digital-land-frontend/dl-frontend";
```

Then run `npm run nps build.stylesheets`.

### JavaScript

`npm run nps copy.javascripts` copies the JavaScript to `jsOutputPath`, including:

* `digital-land-frontend.js`, the component JavaScript. It sets `window.DLFrontend`. Call `window.DLFrontend.initAll()` once the page has loaded.
* `govuk/govuk-frontend.js`, the GOV.UK Frontend JavaScript. It sets `window.GOVUKFrontend`.
* `digital-land-maps.js`, for the map components
* `digital-land-cookies.js`, for the cookie banner

If you use the base layout, you don't need to add these yourself. It includes the scripts and calls both `initAll()` functions, and the map script is included by the `map-assets` partial.

## Use with Flask

These steps assume your app uses an app factory, for example `create_app()` in `application/factory.py`.

### Register the templates

Add a function that registers the templates, and call it from `create_app()`:

```python
def register_templates(app):
    from jinja2 import ChoiceLoader, PackageLoader, PrefixLoader

    app.jinja_loader = ChoiceLoader(
        [
            app.jinja_loader,
            PrefixLoader(
                {
                    "govuk_frontend_jinja": PackageLoader("govuk_frontend_jinja"),
                    "digital-land-frontend": PackageLoader("digital_land_frontend"),
                }
            ),
        ]
    )
```

### Set the asset path

Tell the templates where your static assets are served from, for example in a context processor:

```python
def register_context_processors(app):
    def base_context_processor():
        return {"assetPath": "/static"}

    app.context_processor(base_context_processor)
```

### Register filters and globals

```python
def register_filters(app):
    from digital_land_frontend.filters import commanum_filter, is_list_filter
    from digital_land_frontend.globals import random_int

    app.add_template_filter(is_list_filter, "is_list")
    app.add_template_filter(commanum_filter, "commanum")
    app.jinja_env.globals["random_int"] = random_int
```

### Configure the build scripts

Point the scripts at your Flask app's folders in `digital-land-frontend.config.json`. Keep your source Sass and JavaScript out of the static folder they're served from, for example in `assets/`:

```json
{
  "scssPath": "./assets/scss",
  "stylesheetsOutputPath": "application/static/stylesheets",
  "jsOutputPath": "application/static/javascripts",
  "imagesOutputPath": "application/static/images",
  "govukOutputPath": "application/static/",
  "watchPaths": "'./assets/scss/**/*.scss' './assets/javascripts/**/*.js'"
}
```

### Your own JavaScript

To compile your own JavaScript, create a `rollup.config.js` file with a block for each file:

```js
module.exports = [
  {
    input: "assets/javascripts/application.js",
    output: {
      file: "application/static/javascripts/application.js",
      format: "iife",
    },
  },
];
```

Then run `npm run nps build.javascripts`. If you have JavaScript files that don't need compiling, add your own script to copy them into the static folder.

### Make targets

It's worth adding Makefile targets so the assets can be built with one command:

```make
assets:
	npm run nps copy.javascripts
	npm run nps copy.images
	npm run nps build.javascripts
	npm run nps build.stylesheets

watch:
	npm run nps watch.assets
```

If your app is deployed somewhere that runs `npm install`, add a `postinstall` script to `package.json` so the assets are built on deploy, for example `"postinstall": "npm run nps copy.javascripts && npm run nps build.javascripts && npm run nps build.stylesheets"`.

## Migrating from versions before 0.8.0

Up to 0.7.0, the Python package was installed from the GitHub repository's `main` branch and the npm package was published as `@planning-data/digital-land-frontend`. From 0.8.0, the Python package is published to PyPI and the npm package is published under the `@digital-land-gov-uk` organisation. The `@planning-data` package won't get new versions.

0.8.0 contains the same templates, Sass and JavaScript as 0.7.0, so you can migrate both packages in one change:

1. In your Python requirements, replace the git line:
   ```
   digital_land_frontend @ git+https://github.com/digital-land/digital-land-frontend.git#egg=digital_land_frontend
   ```
   with:
   ```
   digital-land-frontend==X.Y.Z
   ```
   Then recompile your lock file if you have one, for example with `pip-compile`.
2. Replace the npm package:
   ```
   npm uninstall @planning-data/digital-land-frontend
   npm install @digital-land-gov-uk/digital-land-frontend@X.Y.Z
   ```
3. Search your project for `@planning-data/digital-land-frontend` and replace it with `@digital-land-gov-uk/digital-land-frontend`. Check:
   * the `nps` script in `package.json`
   * `digital-land-frontend.config.json`, if you set `digitalLandFrontendPath`
   * any scripts, Sass load paths or docs that point into `node_modules`
4. Rebuild your assets and check your app looks and works as before.
