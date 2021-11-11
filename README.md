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

 ## Components

 - Frontend components will use Jinja templates and will be organised so that the associated Sass/CSS and Javascript will exist in the same directory.

## Partials 

- A partial is a shared piece of jinja which is the same across any digital land application. If the content or structure of the partial needs differ depending on it's context then it should be abstracted as a reusable component.

# Tasks

- [ ] Check the rendered output of jinja templates for consistency of whitespace, and output
- [ ] Review header markup and structure for digital land
- [ ] Review scss files and govuk/all - seperate helpers from generated classes to avoid duplicate css
