# Digital Land Frontend

This repository produces two packages from the same source:

* a **Python package** (`digital-land-frontend`) containing the Jinja templates, components and filters
* an **npm package** (`@digital-land-gov-uk/digital-land-frontend`) containing the Sass, compiled JavaScript, images and build scripts

Apps need both, at the same version. See [Using digital-land-frontend in your projects](#using-digital-land-frontend-in-your-projects).

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

* Python: `pip install build` then `python -m build`. The built package is written to `dist/`. The package is configured in [pyproject.toml](pyproject.toml). Its version comes from the latest git tag (for example `v0.7.0`), worked out by [setuptools-scm](https://setuptools-scm.readthedocs.io/). Builds from commits after a tag get a development version such as `0.7.1.dev3+g1a2b3c4`.
* npm: `make package` (or `npm run build:package`). The package is written to `package/digital-land-frontend/`. This folder is generated, so it is not committed. The publish workflow builds it fresh before publishing. The files that get published are listed in `files` in [package/package.json](package/package.json). Run `npm pack --dry-run` in `package/` to see exactly what would be published.

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

| Type | Use it for | Released? |
|---|---|---|
| `feat` | a new component, feature or option, or a change apps will notice, such as upgrading GOV.UK Frontend | yes |
| `fix` | a bug fix | yes |
| `perf` | a performance improvement | yes |
| `revert` | reverting an earlier change | yes |
| `docs` | documentation only | no |
| `refactor` | code changes that don't change behaviour | no |
| `style` | formatting only | no |
| `test` | adding or changing tests | no |
| `build` | this repo's build tooling, when apps won't notice | no |
| `ci` | GitHub Actions workflows | no |
| `chore` | anything else that doesn't affect the packages | no |

Only the types marked "yes" appear in the changelog and lead to a new release. If apps will notice a change, use `feat` or `fix`, even if it's a dependency or build change.

The scope is optional. Use it to say what the change affects, for example the component name or `python` or `npm`.

If the change will break apps that use the packages, add `!` after the type or scope. Explain what apps need to change in a `BREAKING CHANGE:` paragraph in the PR description, and in the Release PR's changelog entry.

Examples:

* `feat(map): add a layer toggle control`
* `fix(filter-checkboxes): correct the display type for checkbox filtering`
* `feat: upgrade govuk-frontend to 5.12.0`
* `feat(data-table)!: rename the dlDataTable params`
* `ci: cache pip downloads in the test workflow` (not released)

### How releases work

Releases are automated with [release-please](https://github.com/googleapis/release-please) in the [publish workflow](.github/workflows/publish.yml), which runs on every push to `main`.

1. When a releasable PR is merged, release-please opens a **Release PR** called `chore(main): release X.Y.Z`, or updates the one that's already open. The Release PR contains:
   * the next version number, worked out from the PR titles merged since the last release
   * a new [CHANGELOG.md](/CHANGELOG.md) entry listing those PRs
   * the new version in `package/package.json`
2. Leave the Release PR open while you merge other work. It updates itself each time.
3. When you want to release, review the Release PR. You can edit the changelog wording in it. Then merge it. Release PRs don't trigger the test workflow, so an admin has to merge them using the branch ruleset bypass.
4. Merging the Release PR makes the publish workflow:
   * create the `vX.Y.Z` git tag and a GitHub release with the changelog entry as its notes
   * publish the npm package to npm
   * publish the Python package to [PyPI](https://pypi.org/project/digital-land-frontend/). Its version is read from the git tag by setuptools-scm.

The Python and npm packages always get the same version, even when a change only affects one of them. That way apps only need to know one rule: use the same version of both.

### Version numbers

We follow [Semantic Versioning](https://semver.org/). Until 1.0.0:

| PR title | Version change | Example |
|---|---|---|
| `fix:`, `perf:` | patch | 0.8.0 → 0.8.1 |
| `feat:` | patch | 0.8.0 → 0.8.1 |
| `feat!:`, `fix!:` (breaking) | minor | 0.8.0 → 0.9.0 |

This follows the usual convention for 0.x versions: a minor version change means "check the changelog before upgrading". npm's `^0.8.0` ranges also only accept 0.8.x updates.

From 1.0.0 the usual rules apply: `fix` is a patch, `feat` is a minor version and a breaking change is a major version.

Breaking changes include renaming or removing a component, macro or parameter, changing markup that apps' CSS or JavaScript relies on, and changes that need apps to update their build.

### Choosing a version number

To release a specific version instead of the one release-please works out, add a `Release-As` footer to the commit body when you squash merge a PR:

```
Release-As: 1.0.0
```

The Release PR then changes to that version. If you forget, merge a PR with an empty commit that has the footer:

```
git commit --allow-empty -m "chore: release 1.0.0" -m "Release-As: 1.0.0"
```

Don't change the version in the Release PR by hand. release-please overwrites it the next time it runs.

### Releasing GOV.UK Frontend v6 as 1.0.0

1.0.0 is planned to be the upgrade to GOV.UK Frontend v6. For that PR:

1. Title it `feat!: upgrade to GOV.UK Frontend v6`.
2. In the same PR, pin `govuk-frontend` in both `package.json` files and `govuk-frontend-jinja` in `pyproject.toml` to the matching v6 versions.
3. Explain what apps need to change in a `BREAKING CHANGE:` paragraph in the PR description.
4. Add `Release-As: 1.0.0` to the commit body when you squash merge it.

### If a publish fails

The npm and PyPI jobs run independently. If one fails, fix the problem and use **Re-run failed jobs** on the workflow run. Don't use "Re-run all jobs": the release-please job won't create the release a second time, so the publish jobs would be skipped.

### One-time setup

Publishing needs these settings outside the code. They're recorded here so they can be checked or done again.

Repository settings:

* Settings → General → Pull Requests: allow squash merging only, with **Pull request title** as the default commit message
* Settings → Actions → General: tick **Allow GitHub Actions to create and approve pull requests**, so release-please can open Release PRs
* Settings → Rules → Rulesets: a ruleset for `main` that requires the test workflow's checks, with **Repository admin** allowed to bypass for pull requests (needed to merge Release PRs)

PyPI, using [trusted publishing](https://docs.pypi.org/trusted-publishers/) so no token is stored:

* the `digital-land-frontend` project has a trusted publisher for repository `digital-land/digital-land-frontend`, workflow `publish.yml`, environment `pypi`
* before the first release this was added as a "pending publisher" from your PyPI account

npm, in the `digital-land-gov-uk` organisation:

* The first release has to be published with a token, because trusted publishing can only be set up on a package that already exists. The `NPM_TOKEN` repository secret holds a granular access token with read and write access to the organisation's packages.
* To switch to [trusted publishing](https://docs.npmjs.com/trusted-publishers), go to the package's Settings → Trusted publishing on npmjs.com and add GitHub Actions with repository `digital-land/digital-land-frontend` and workflow `publish.yml`. A new trusted publisher expires if it isn't used to publish within 2 days, so add it shortly before merging a Release PR.
* Once a release has been published with trusted publishing, delete the `NPM_TOKEN` secret and revoke the token.

## Using digital-land-frontend in your projects

You need to install the Python and npm packages, at the same version. See the [changelog](CHANGELOG.md) for what's in each version.

Install the Python package from [PyPI](https://pypi.org/project/digital-land-frontend/). For example, in `requirements.in`:
```
digital-land-frontend==0.8.0
```
This gives you access to all the templates and Jinja filters.

Then install the npm package:
```
npm install @digital-land-gov-uk/digital-land-frontend@0.8.0
```
This gives you access to the Sass, the compiled JavaScript and the npm build scripts you can use in your projects.

Once installed, add the following line to `scripts` in `package.json`:
```
"nps": "nps -c ./node_modules/@digital-land-gov-uk/digital-land-frontend/package-scripts.js"
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

### Migrating from versions before 0.8.0

Up to 0.7.0, the Python package was installed from this repository's `main` branch and the npm package was published as `@planning-data/digital-land-frontend`. From 0.8.0, the Python package is published to PyPI and the npm package is published under the `@digital-land-gov-uk` organisation. The `@planning-data` package is deprecated and won't get new versions.

0.8.0 contains the same templates, Sass and JavaScript as 0.7.0, so you can migrate both packages in one PR:

1. In your Python requirements, replace the git line:
   ```
   digital_land_frontend @ git+https://github.com/digital-land/digital-land-frontend.git#egg=digital_land_frontend
   ```
   with:
   ```
   digital-land-frontend==0.8.0
   ```
   Then recompile your lock file if you have one, for example with `pip-compile`.
2. Replace the npm package:
   ```
   npm uninstall @planning-data/digital-land-frontend
   npm install @digital-land-gov-uk/digital-land-frontend@0.8.0
   ```
3. Search your repo for `@planning-data/digital-land-frontend` and replace it with `@digital-land-gov-uk/digital-land-frontend`. Check:
   * the `nps` script in `package.json`
   * `digital-land-frontend.config.json`, if you set `digitalLandFrontendPath`
   * any `package-scripts.js`, Sass load paths or docs that point into `node_modules`
4. Rebuild your assets, for example `npm run nps build.stylesheets` and `npm run nps copy.javascripts`, and check the app looks and works as before.

# Tasks

- [ ] Check the rendered output of jinja templates for consistency of whitespace, and output
- [ ] Review header markup and structure for digital land
- [ ] Review scss files and govuk/all - seperate helpers from generated classes to avoid duplicate css
