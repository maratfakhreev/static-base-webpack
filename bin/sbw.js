#!/usr/bin/env node

'use strict';

const program = require('commander');
const pjson = require('../package.json');
const sbw = require('../');

program
  .version(pjson.version);

program
  .command('init')
  .action(() => sbw.init());

program
  .command('build')
  .action(() => sbw.build());

program
  .command('serve')
  .action(() => sbw.serve());

program
  .command('lint')
  .action(() => sbw.lint());

program.parse(process.argv);
