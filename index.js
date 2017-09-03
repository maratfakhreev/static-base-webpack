'use strict';

const shell = require('shelljs');
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');

const logger = (err, stats) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(stats.toString({
    assets: true,
    chunks: false,
    modules: false,
    colors: true,
    performance: true,
    timings: true,
    version: true,
    warnings: true
  }));
};

const init = () => {
  shell.cp('-R', path.resolve(__dirname, './blueprint/.*'), process.cwd());
  shell.cp('-R', path.resolve(__dirname, './blueprint/*'), process.cwd());
};

const clean = () => {
  shell.rm('-rf', path.resolve(process.cwd(), 'build'));
};

const build = () => {
  clean();
  webpack(config).run(logger);
};

const serve = () => {
  clean();
  webpack(config).watch(
    {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    },
    logger
  );
};

const lint = () => {
  const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
  const eslintConfig = path.resolve(__dirname, '.eslintrc');
  const stylelintBin = path.resolve(__dirname, 'node_modules/stylelint/bin/stylelint.js');
  const stylelintConfig = path.resolve(__dirname, '.stylelintrc');
  const sourcesPath = path.resolve(process.cwd(), 'src');
  const eslintExec = `${eslintBin} --config=${eslintConfig} '${sourcesPath}'`;
  const stylelintExec = `${stylelintBin} --config=${stylelintConfig} '${sourcesPath}/**/*.css'`;

  shell.exec(`${stylelintExec} && ${eslintExec}`).stdout;
};

const fix = () => {
  const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
  const eslintConfig = path.resolve(__dirname, '.eslintrc');
  const stylefmtBin = path.resolve(__dirname, 'node_modules/stylefmt/bin/cli.js');
  const stylelintConfig = path.resolve(__dirname, '.stylelintrc');
  const sourcesPath = path.resolve(process.cwd(), 'src');
  const eslintFixExec = `${eslintBin} --config=${eslintConfig} '${sourcesPath}' --fix`;
  const stylefmtFixExec = `${stylefmtBin} --config=${stylelintConfig} --recursive '${sourcesPath}/**/*.css'`;

  shell.exec(`${stylefmtFixExec} && ${eslintFixExec}`).stdout;
};

module.exports = {
  init,
  clean,
  build,
  serve,
  lint,
  fix
};
