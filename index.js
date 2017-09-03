#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const shell = require('shelljs');
const path = require('path');
const webpack = require('webpack');
const pjson = require('./package.json');
const config = require('./webpack.config');

const logger = (err, stats) => {
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

const exit = () => {
  process.exit(1);
};

const compiler = () => {
  const viewsDir = path.resolve(process.cwd(), 'src/views');
  const buildDir = path.resolve(process.cwd(), 'build');

  return new Promise((resolve, reject) => {
    shell.rm('-rf', buildDir);

    fs.readdir(viewsDir, (err, files) => {
      if (err) {
        console.error('Could not list the directory', err);
        reject(err);
      } else {
        const views = files.filter(file => (
          fs.lstatSync(path.resolve(viewsDir, file)).isFile()
        ));

        resolve(webpack(config(views)));
      }
    });
  });
};

program
  .version(pjson.version);

program
  .command('init')
  .action(() => {
    shell.cp('-R', path.resolve(__dirname, './blueprint/.*'), process.cwd());
    shell.cp('-R', path.resolve(__dirname, './blueprint/*'), process.cwd());
  });

program
  .command('build')
  .action(() => {
    compiler()
      .then(c => c.run(logger))
      .catch(exit);
  });

program
  .command('lint')
  .action(() => {
    const eslintBin = path.resolve(__dirname, 'node_modules/eslint/bin/eslint.js');
    const eslintConfig = path.resolve(__dirname, '.eslintrc');
    const stylelintBin = path.resolve(__dirname, 'node_modules/stylelint/bin/stylelint.js');
    const stylelintConfig = path.resolve(__dirname, '.stylelintrc');
    const sourcesPath = path.resolve(process.cwd(), 'src');
    const stylelintSourcesPath = `${sourcesPath}/**/*.css ${sourcesPath}/**/*.pcss`;
    const eslintExec = `${eslintBin} --config=${eslintConfig} ${sourcesPath}`;
    const stylelintExec = `${stylelintBin} --config=${stylelintConfig} ${stylelintSourcesPath}`;

    shell.exec(`${stylelintExec} && ${eslintExec}`).stdout;
  });

program
  .command('serve')
  .action(() => {
    compiler()
      .then(c => {
        c.watch(
          {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
          },
          logger
        );
      })
      .catch(exit);
  });

program.parse(process.argv);
