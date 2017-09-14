# Static Sites generator based on webpack

Kick-start your new static site application based on next technologies:
- `pug` as template engine
- `postcss` as stylesheets postprocessor
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