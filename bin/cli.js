#!/usr/bin/env node

'use strict';

const program = require('commander');
const pjson = require('../package.json');
const sbw = require('../');

program.version(pjson.version);
Object.keys(sbw).forEach(command => {
  program.command(command).action(sbw[command]);
});
program.parse(process.argv);
