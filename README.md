# Digital Land Frontend

## Requirements

- Node V16+
- Python 3.5
- PIP

## Getting started

This documentation assumes you have installed [Python](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python) and [Node](https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/). We recommend using 'Node Version Manager' (NVM) because this repository has a [.nvmrc](.nvmrc) file which will ensure you are using the correct version of NodeJS.

1. Clone this repository:
```
git clone git@github.com:digital-land/digital-land-frontend.git
```
2. In terminal, switch to the root directory of the cloned repository.
3. Make sure you are using the correct Node version. Users of RVM can type `rvm use`
2. Run `npm install` to install all the node packages

We use a `.editorconfig` file to ensure code consistency. There are [plugins for the popular editors](https://editorconfig.org/#download).

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

1. Default to using [GOVUK Components](https://design-system.service.gov.uk/components/) first which have the benefit of being used and research in many services and the overight of a working group who assess them against the service standard.

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

## Using digital-land-frontend in your projects

You need to install the python and npm packages.

Install the python package by running
```
pip install git+https://github.com/digital-land/digital-land-frontend.git#egg=digital_land_frontend
```
This gives you access to all the templates and jinja filters.

Then install the npm package by running
```
npm install https://github.com/digital-land/digital-land-frontend/tree/main/package
```
This gives you access to the scss, the compiled js and the npm build scripts you can use in your projects.


Once installed add the following line to `package.json` `scripts`
```
"nps": "nps -c ./node_modules/digital-land-frontend/package-scripts.js"
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
