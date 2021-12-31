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

### Set up stylesheet compiler

You need to update the include paths for libsass. Do this in `assets.py`. Update include paths to be:

```
libsass_output = LibSass(
    include_paths=[
        static('scss'),
        'node_modules/govuk-frontend/',
        "node_modules/digital-land-frontend",
    ]
)
```

Then, in your `main.scss` file import just the digital land frontend (this will import what it needs from govuk).

```
// import all digital land and GOVUK Frontend scss
@import "digital-land-frontend/dl-frontend";
```

### Adding custom javascript

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
