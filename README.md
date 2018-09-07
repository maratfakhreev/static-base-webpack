# Static Sites generator based on webpack

[![Build Status](https://travis-ci.org/maratfakhreev/static-base-webpack.svg?branch=master)](https://travis-ci.org/maratfakhreev/static-base-webpack)
[![Dependency Status](https://david-dm.org/maratfakhreev/static-base-webpack.svg)](https://david-dm.org/maratfakhreev/static-base-webpack)

Kick-start your new static site application based on next technologies:
- `handlebars` as template engine
- `postcss/cssnext` as stylesheets processor
- `babel` as javascript compiler
- `webpack` as module bundler
- `browsersync` as http server
- `eslint/stylelint` as linting tools

## Quick start

Clone application and link it as global npm package.

```bash
git clone git@github.com:maratfakhreev/static-base-webpack.git static-base-webpack
cd static-base-webpack
npm link
```

## Use

Create new static site project.

```bash
mkdir new-static-project && cd new-static-project
sb init
```

### Available commands

```bash
sb init # initialize new project
sb serve # serve and watch project via webpack and browsersync
sb build # build the project
sb lint # lint project via stylelint and eslint
sb fix # fix linter issues
```

For `sb serve` you can also pass `PORT` and `NODE_ENV` params.

```bash
sb serve PORT=3000 NODE_ENV=production # default values are PORT=8000 NODE_ENV=development
```
