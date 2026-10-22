# Digital Land Frontend

This repository produces two packages from the same source:

* a **Python package** (`digital-land-frontend`) containing the Jinja templates, components and filters
* an **npm package** (`@digital-land-gov-uk/digital-land-frontend`) containing the Sass, compiled JavaScript, images and build scripts

Apps need both, at the same version.

This README is for developing and publishing the packages. **If you want to use them in an app, see the [package README](package/README.md)**, which is also shown on [PyPI](https://pypi.org/project/digital-land-frontend/) and [npm](https://www.npmjs.com/package/@digital-land-gov-uk/digital-land-frontend).

## Development

### Requirements

- [Python](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python) 3.10+
- [Node](https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/) 22.12+. We recommend Node 24, which the CI checks and publishing use.

We recommend using Node Version Manager (nvm). This repository has a [.nvmrc](.nvmrc) file, so running `nvm use` switches to Node 24.

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

Run all the tests with `make test`, or run each set on its own:

| Command | What it tests |
|---|---|
| `python -m pytest tests/unit` | the Python package: filters, globals and templates |
| `npm test` | the npm package, using [vitest](https://vitest.dev/) |

The tests are organised by kind:

* `tests/unit/` holds Python unit tests, run with pytest. They don't need anything built.
* `tests/integration/javascript/` holds tests that use the npm package the way an app does. Each test creates a temporary app, links the built package and `govuk-frontend` into its `node_modules`, and runs the real build scripts from [package-scripts.js](package/package-scripts.js) in it. `npm test` builds the package first, so the tests never run against an old build. The helpers for this are in `tests/integration/javascript/helpers/`.

When you fix a bug, add a test that fails without the fix.

### Building the packages

* Python: `pip install build` then `python -m build`. The built package is written to `dist/`. The package is configured in [pyproject.toml](pyproject.toml). Its version comes from the latest git tag (for example `v0.7.0`), worked out by [setuptools-scm](https://setuptools-scm.readthedocs.io/). Builds from commits after a tag get a development version such as `0.7.1.dev3+g1a2b3c4`.
* npm: `make package` (or `npm run build:package`). The package is written to `package/digital-land-frontend/`. This folder is generated, so it is not committed. The publish workflow builds it fresh before publishing. The files that get published are listed in `files` in [package/package.json](package/package.json). Run `npm pack --dry-run` in `package/` to see exactly what would be published.

### Checks on pull requests

The [test workflow](.github/workflows/test.yml) runs on every pull request. It can also be run by hand from the Actions tab. It:

* runs the Python unit tests
* builds the Python package and checks the built package can load all of its templates
* builds the npm package, lists its contents and runs the JavaScript tests
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
2. In the same PR, pin `govuk-frontend` in both `package.json` files and `govuk-frontend-jinja` in `pyproject.toml` to the matching v6 versions. Update the GOV.UK Frontend versions in the [package README](package/README.md#installation) too.
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

See the [package README](package/README.md) for installing the packages, using the templates, filters, Sass and JavaScript, setting up a Flask app, and migrating from versions before 0.8.0.

The package README is published to both registries: PyPI uses it through `readme` in `pyproject.toml`, and npm includes it in the npm package. Keep it written for app developers, and use full URLs for links, because PyPI doesn't resolve relative links. Changes to it appear on PyPI and npm with the next release.

# Tasks

- [ ] Check the rendered output of jinja templates for consistency of whitespace, and output
- [ ] Review header markup and structure for digital land
- [ ] Review scss files and govuk/all - seperate helpers from generated classes to avoid duplicate css
