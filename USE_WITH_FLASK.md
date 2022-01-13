# How to use digital land frontend with flask

### Install

Add the python package to your `requirements.txt` file.

```
-e git+https://github.com/digital-land/digital-land-frontend.git#egg=digital-land-frontend
```

And add the node package to your `package.json` file.

```
"dependencies": {
  "digital-land-frontend": "https://gitpkg.now.sh/digital-land/digital-land-frontend/package?main"
}
```

Also add an `nps` script to `package.json`.
```
"scripts": {
  "nps": "nps -c ./node_modules/digital-land-frontend/package-scripts.js"
}
```

Create a config file called `digital-land-frontend.config.json`. Use this file to override the default paths the common npm scripts use.

For example, update the path to where you have your source scss files.
```
{
  "scssPath": "./assets/scss",
  ...
}
```

### Register templates

You will need to register the templates with flask to be able to use and extend them.

If you are using the factory pattern we recommend adding a function to register the templates. For example:

```
def register_templates(app):
    """
    Register templates from packages
    """
    from jinja2 import PackageLoader, PrefixLoader, ChoiceLoader

    multi_loader = ChoiceLoader(
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
    app.jinja_loader = multi_loader
```

Don't forget to call this function from the `create_app()` (or equivalent) function.

You will also need to set the `assetPath` global variable. In `factory.py` add this to `register_context_processors()`.
```
def base_context_processor():
  return {"assetPath": "/static"}
``` 

### Custom scss

Make sure you have set the correct input and output paths in the `digital-land-frontend.config.json` config file.
```
{
  "scssPath": "./assets/scss",
  "stylesheetsOutputPath": "application/static/stylesheets",
  ...
}
```

Then, in your `main.scss` file import the digital land frontend (this will also import what it needs from govuk).

```
// import all digital land and GOVUK Frontend scss
@import "digital-land-frontend/dl-frontend";
```

You can now compile you stylesheets by running `npm run nps build.stylesheets`.

### Custom javascript

You need to put your custom js files into a folder different to the static folder they will get served from. This will allow digital-land-frontend to copy the right files to the right place when compiling your custom js.

We recommend putting your custom js in `assets/javascripts`.

Then create a `copyjs` script in `package.json->scripts`. This should copy again js files that don't need to be compiled via rollup.

Next, create a `digital-land-frontend.config.json` file. In here, set a path to the javascript folder flask serves. E.g.

```
{
  "jsOutputPath": "application/static/javascripts"
}
```
Now, when you run `npm run nps copy.javascripts` the javascripts from digital-land-frontend will be copy to the correct folder.

#### Compiling custom js

Create a `rollup.config.js` file. Put config blocks in here for any js files you want rollup to compile. E.g.

```
module.exports = [
  {
    input: `assets/javascripts/test.js`,
    output: {
      file: `application/static/javascripts/test.js`,
      format: "iife",
    }
  }
];
```

Now you can run
```
npm run nps build.javascripts
```

to compile your js files.

### Setup watch

To setup up watch you will need to set the watch paths in `digital-land-frontend.config.json` . E.g.
```
{
  "watchPaths": "'./assets/scss/**/*.scss' './assets/javascripts/**/*.js'"
  ... 
}
```

You can then run the watch scripts with `npm run nps watch.assets` and `npm run nps watch.pages`

We recommend adding watch scripts to `package.json` so you can run these as one script. E.g.
```
scripts: {
  ...,
  "watch:assets": "npm run nps watch.assets",
  "watch:pages": "npm run nps watch.pages",
  "watch": "npm-run-all --parallel watch:*"
}
```

#### Bringing it together

To get the js ready for the flask app there are now 3 commands to run. It is worth adding these to a make target in a Makefile so you only have to run `make javascripts`. The target should look like:
```
javascripts:
	npm run copyjs
	npm run nps copy.javascripts
	npm run nps build.javascripts
```

Also add a stylesheets target.
```
stylesheets:
  npm run nps build.stylesheets
```

If you are auto-deploying your flask app (for example, on Heroku) you will also need to add a `postinstall` script to `package.json` so that these commands are run on deploy. Add
```
"scripts": {
  ...,
  "postinstall": "npm run copyjs && npm run nps copy.javascripts && npm run nps build.javascripts && "
}
```

You might also want to add a watch target to you Makefile. E.g.
```
watch:
	npm run watch
```
