#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var Whisper = require('..');

var secretFile = argv['secret-file'];
var type;

if (!secretFile) throw new Error('You need to specify a secret-file');

if (argv.encrypt) type = 'encrypt';
else if (argv.decrypt) type = 'decrypt';
else throw new Error('Must pass --encrypt or --decrypt');

var file = path.isAbsolute(secretFile)
  ? secretFile
  : path.resolve(process.cwd(), secretFile)

var opts = {
  secret: fs.readFileSync(file, 'utf8'),
  alg: argv.algorithm || argv.alg
};

process.stdin.pipe(new Whisper(type, opts)).pipe(process.stdout);

