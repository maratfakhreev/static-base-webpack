const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const config = require('./webpack.config');

// Utils

const logger = (err, stats) => {
  /* eslint-disable no-console */
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
    warnings: true,
  }));
  /* eslint-enable no-console */
};

const prepareParams = (params) => {
  const arr = [...params];

  arr.pop();

  return arr.reduce((acc, v) => {
    const value = v.split('=');

    return { ...acc, [value[0]]: value[1] };
  }, {});
};

// Tasks

const clean = () => {
  shell.rm('-rf', path.resolve(process.cwd(), 'build'));
};

const build = () => {
  const params = { NODE_ENV: 'production' };

  clean();
  webpack(config(params)).run(logger);
};

const serve = (...p) => {
  const params = prepareParams(p);

  clean();
  webpack(config(params)).watch(
    {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/,
    },
    logger,
  );
};

const init = () => {
  shell.cp(
    '-R',
    [
      path.resolve(__dirname, 'blueprint/*'),
      path.resolve(__dirname, 'blueprint/.*'),
    ],
    process.cwd(),
  );
};

const lint = () => {
  const sourcesPath = path.resolve(process.cwd(), 'src');

  const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
  const eslintConfig = path.resolve(__dirname, '.eslintrc');
  const eslintExec = `${eslintBin} --config=${eslintConfig} '${sourcesPath}'`;

  const stylelintBin = path.resolve(__dirname, 'node_modules/stylelint/bin/stylelint.js');
  const stylelintConfig = path.resolve(__dirname, '.stylelintrc');
  const stylelintExec = `${stylelintBin} --config=${stylelintConfig} '${sourcesPath}/**/*.css'`;

  shell.exec(`${stylelintExec} && ${eslintExec}`);
};

const fix = () => {
  const sourcesPath = path.resolve(process.cwd(), 'src');

  const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
  const eslintConfig = path.resolve(__dirname, '.eslintrc');
  const eslintFixExec = `${eslintBin} --config=${eslintConfig} '${sourcesPath}' --fix`;

  const stylelintBin = path.resolve(__dirname, 'node_modules/stylelint/bin/stylelint.js');
  const stylelintConfig = path.resolve(__dirname, '.stylelintrc');
  const stylelintFixExec = `${stylelintBin} --config=${stylelintConfig} '${sourcesPath}/**/*.css' --fix`;

  shell.exec(`${stylelintFixExec} && ${eslintFixExec}`);
};

// CLI Commands

module.exports = {
  clean,
  build,
  serve,
  init,
  lint,
  fix,
};
