const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const mildCompile = require('webpack-mild-compile');
const config = require('./webpack.config');

// Utils

const compiler = (config) => {
  const compiler = webpack(config);

  mildCompile(compiler);

  return compiler;
};

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

// Tasks

const clean = () => {
  shell.rm('-rf', path.resolve(process.cwd(), 'build'));
};

const build = () => {
  clean();
  compiler(config).run(logger);
};

const serve = () => {
  clean();
  compiler(config).watch(
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
  const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
  const eslintConfig = path.resolve(__dirname, '.eslintrc');
  const stylelintBin = path.resolve(__dirname, 'node_modules/stylelint/bin/stylelint.js');
  const stylelintConfig = path.resolve(__dirname, '.stylelintrc');
  const sourcesPath = path.resolve(process.cwd(), 'src');
  const eslintExec = `${eslintBin} --config=${eslintConfig} '${sourcesPath}'`;
  const stylelintExec = `${stylelintBin} --config=${stylelintConfig} '${sourcesPath}/**/*.css'`;

  shell.exec(`${stylelintExec} && ${eslintExec} --color always`);
};

const fix = () => {
  const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
  const eslintConfig = path.resolve(__dirname, '.eslintrc');
  const sourcesPath = path.resolve(process.cwd(), 'src');
  const eslintFixExec = `${eslintBin} --config=${eslintConfig} '${sourcesPath}' --fix`;

  shell.exec(`${eslintFixExec} --color always`);
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
