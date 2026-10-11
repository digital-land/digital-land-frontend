# Digital Land Frontend

This repository produces two packages from the same source:

* a **Python package** (`digital-land-frontend`) containing the Jinja templates, components and filters
* an **npm package** (`@planning-data/digital-land-frontend`) containing the Sass, compiled JavaScript, images and build scripts

Apps need both. See [Using digital-land-frontend in your projects](#using-digital-land-frontend-in-your-projects).

## Development

### Requirements

- [Python](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python) 3.10+
- [Node](https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/) 16+ (the CI checks use Node 24)

We recommend using Node Version Manager (nvm). This repository has a [.nvmrc](.nvmrc) file, so running `nvm use` switches to the right version of Node.

### Setting up

1. Clone this repository and move into it:
   ```
   git clone git@github.com:digital-land/digital-land-frontend.git
   cd digital-land-frontend
   ```
2. Create and activate a virtual environment:
   ```
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install the Python package in editable mode with its test dependencies:
   ```
   pip install -e ".[testing]"
   ```
4. Install the node packages:
   ```
   npm install
   ```

We use a `.editorconfig` file to ensure code consistency. There are [plugins for the popular editors](https://editorconfig.org/#download).

### Running the tests

```
python -m pytest tests/unit
```

### Building the packages

* Python: `pip install build` then `python -m build`. The built package is written to `dist/`.
* npm: `make package` (or `npm run build:package`). The package is written to `package/digital-land-frontend/`. Run `npm pack --dry-run` in `package/` to see exactly what would be published.

### Checks on pull requests

The [test workflow](.github/workflows/test.yml) runs on every pull request. It can also be run by hand from the Actions tab. It:

* runs the Python unit tests
* builds the Python package and checks the built package can load all of its templates
* builds the npm package and lists its contents
* checks the pull request title follows the [pull request title rules](#pull-request-titles). This check only runs for pull requests.

## Templates

All templates for HTML pages used within digital land applications will be written in Jinja and use the file extension `.jinja`.

When writing blocks in Jinja ensure the name is added to the endblock statement for example:

```
{%- block headEnd %}...{%- endblock headEnd %}
```

### Directories

* `layouts/` - page layout templates
* `components/` - individual components
* `partials/` - jinja/html snippets where we want the content to be consistent

## Components

- Frontend components will use Jinja templates and will be organised so that the associated Sass/CSS and Javascript will exist in the same directory.

### Creating a component

When creating a component you should follow these steps:

- create a directory in `digital_land_frontend/templates/components`
- in that directory add
  - `macro.jinja` - for the template
  - `_<component_name>.scss` - for the associated styles
  - `<component_name>.js` - for the associate javascript (if applicable)
- import the `.scss` into `digital_land_frontend/src/scss/dl-frontend.scss`
- import the `.js` modules into `digital_land_frontend/src/javascripts/dligital-land-frontend.js`
- check files pass linting

### The component life-cycle

When building the frontend for digital-land apps, we follow a modular "BEM"-like structure based on the [GOVUK Design System](https://design-system.service.gov.uk/). We have some principles for using, designing and building components:

1. Default to using [GOVUK Components](https://design-system.service.gov.uk/components/) first which have the benefit of being used and researched in many services across government as well as the overight of a working group who assess them against the service standard.

2. If a new component or design pattern is deemed neccessary it should first be prototyped and tested within the context of the specific service the need arose. This is when it would be given an 'app-' namespace (see [CSS](#css))

3. If the same user need arises in a different digital-land service then the work should be done to 'promote' the component to digital-land-frontend, this means the same design solution can be kept in sync across both apps, each benefitting from the iterations and research done across both services.

## CSS

When writing Sass/CSS you should follow the established class naming convention:

### App/Service specific components

New components not applicable or ready to be added to this repository should be name spaced as 'app-[componentname]' for example:

`.app-numeric-counter`

### Shared components for Digital Land apps/services

Components within this respository deemed a solution to a common problem and of sufficient quality to be shared across all digital land apps and services, namespace with 'dl-[componentname]' for example:

`.dl-data-table`

## Partials

- A partial is a shared piece of jinja which is the same across any digital land application. If the content or structure of the partial needs differ depending on it's context then it should be abstracted as a reusable component.

## Publishing

### Pull request titles

Pull requests are squash merged, so the PR title becomes the commit message on `main`. PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/). The [test workflow](.github/workflows/test.yml) checks this, and the check re-runs when you edit the title.

The format is:

```
<type>(<optional scope>): <description>
```

| Type | Use it for |
|---|---|
| `feat` | a new component, feature or option |
| `fix` | a bug fix |
| `perf` | a performance improvement |
| `docs` | documentation only |
| `refactor` | code changes that don't change behaviour |
| `style` | formatting only |
| `test` | adding or changing tests |
| `build` | the build process, packaging or dependencies |
| `ci` | GitHub Actions workflows |
| `chore` | anything else that doesn't affect the packages |
| `revert` | reverting an earlier change |

The scope is optional. Use it to say what the change affects, for example the component name or `python` or `npm`.

If the change will break apps that use the packages, add `!` after the type or scope. Explain what apps need to change in the PR description.

Examples:

* `feat(map): add a layer toggle control`
* `fix(filter-checkboxes): correct the display type for checkbox filtering`
* `build: upgrade govuk-frontend to 5.11.1`
* `feat(data-table)!: rename the dlDataTable params`

These titles will later be used to generate the changelog and work out version numbers automatically. Until then, follow the process below.

### Publishing a new version

The npm package is published automatically by the [publish package workflow](.github/workflows/publish-package.yml) when the version in `package/package.json` changes on `main`. The workflow:

1. checks whether the version in `package/package.json` is different from the latest GitHub release
2. if it is, builds the package with `make package` and publishes it to npm using the `NPM_TOKEN` repository secret
3. creates a GitHub release for the new version

The Python package is not published. Apps install it from this repository's `main` branch.

To publish a new version:

1. Decide the new version number using the [versioning strategy](#versioning-strategy).
2. Update the version in both `package/package.json` and `setup.py`.
3. Add the changes to [CHANGELOG.md](/CHANGELOG.md).
4. Open a pull request with these changes. Once it's merged, the npm package is published.

### Versioning strategy

We follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH) for both the npm and Python packages. Here's our versioning strategy:

#### Patch Version (x.y.z → x.y.z+1)
- Bug fixes that don't change existing functionality
- Minor CSS adjustments that don't affect layout
- Documentation updates
- Performance improvements
- Security patches

#### Minor Version (x.y.z → x.y+1.0)
- New features that don't break existing functionality
- New components that are backward compatible
- Enhancement of existing components
- New utility functions or helpers
- Deprecation notices (but not removal)

#### Major Version (x.y.z → x+1.0.0)
- Breaking changes to existing components
- Removal of deprecated features
- Major structural changes to the codebase
- Changes that require updates to consuming applications
- Significant changes to the build process

Remember to always update the [CHANGELOG.md](/CHANGELOG.md) file when bumping versions to document the changes made.

## Using digital-land-frontend in your projects

You need to install the python and npm packages.

Install the python package by running
```
pip install git+https://github.com/digital-land/digital-land-frontend.git#egg=digital_land_frontend
```
This gives you access to all the templates and jinja filters.

Then install the npm package by running
```
npm install @planning-data/digital-land-frontend
```
This gives you access to the scss, the compiled js and the npm build scripts you can use in your projects.


Once installed add the following line to `package.json` `scripts`
```
"nps": "nps -c ./node_modules/@planning-data/digital-land-frontend/package-scripts.js"
```

In your project you can now build the stylesheets by running:
```
npm run nps build.stylesheets
```

and you can put the js in the right location by running
```
npm run nps copy.javascripts
```

To change where these files are outputted create a `digital-land-frontend.config.json` file. In here you can set these options:

* digitalLandFrontendPath
* govukFrontendPath
* scssPath
* stylesheetsOutputPath
* jsOutputPath
* rollupConfig

If your project needs custom js you can use the pre-installed rollup task by creating a `rollup.config.js` file and once you are ready, running
```
npm run nps build.javascripts
```

# Tasks

- [ ] Check the rendered output of jinja templates for consistency of whitespace, and output
- [ ] Review header markup and structure for digital land
- [ ] Review scss files and govuk/all - seperate helpers from generated classes to avoid duplicate css
