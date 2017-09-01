#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const shell = require('shelljs');
const path = require('path');
const webpack = require('webpack');
const pjson = require('./package.json');
const config = require('./webpack.config');

program
  .version(pjson.version);

program
  .command('init')
  .action(() => {
    shell.cp('-R', path.resolve(__dirname, './blueprint/*'), process.cwd());
  });

program
  .command('build')
  .action(() => {
    const compiler = webpack(config);

    compiler.run();
  });

program
  .command('serve')
  .action(() => {
    const dir = path.resolve(process.cwd(), 'src/pages');

  	fs.readdir(dir, (err, files) => {
  		if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }

      webpack(config(files)).watch({
        aggregateTimeout: 300,
        poll: true,
        ignored: /node_modules/
      }, function(err, stats) {
        console.log(stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true
        }));
      });
  	});
  });

program.parse(process.argv);
