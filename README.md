# generator-sda

> A generator for Yeoman.  

- It generates a Backbone Marionette project with RequireJS, Handlebars and Knockout.
- All RequireJS configuration is centralized in one file: no multiple conf for dev, prod and tests.
- Grunt automates the tasks: JsHint validation, RequireJS optimization, Jasmine tests, Casper tests...
- Dev environment is running in an Express NodeJS server.

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator:

```bash
git clone git@github.com:sebastiendavid/generator-sda.git
cd generator-sda
npm install
sudo npm link
```

- Run: `yo sda`
