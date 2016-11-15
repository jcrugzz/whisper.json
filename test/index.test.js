'use strict';

var assume = require('assume');
var from = require('from2-string');
var os = require('os');
var fs = require('fs');
var path = require('path');
var Whisper = require('..');

describe('whisper-stream', function () {
  var opts = {
    secret: fs.readFileSync(path.join(__dirname, 'fixtures', 'test.key'), 'utf8')
  };

  var eOutput = path.join(__dirname, 'e-output.json');
  var dOutput = path.join(__dirname, 'd-output.json');
  var decrypt = new Whisper('decrypt', opts);
  var encrypt = new Whisper('encrypt', opts);

  var config = {
    what: 'happens',
    when: 'i',
    say: 'hello'
  };

  it('should encrypt a config stream', function (done) {
    from(JSON.stringify(config, null, 2))
      .pipe(encrypt)
      .pipe(fs.createWriteStream(eOutput))
        .on('finish', function () {
          var json = JSON.parse(fs.readFileSync(eOutput, 'utf8'));
          assume(json.what);
          assume(json.when);
          assume(json.say);
          done();
        });
  });

  it('should decrypt a config stream', function (done) {
    fs.createReadStream(eOutput)
      .pipe(decrypt)
      .pipe(fs.createWriteStream(dOutput))
        .on('finish', function () {
          var json = JSON.parse(fs.readFileSync(dOutput, 'utf8'));
          assume(json).deep.equals(config);
          done();
        });
  });

  after(function (done) {
    var count = 2;
    var next = function () {
      if (--count === 0) done();
    };
    fs.unlink(eOutput, next);
    fs.unlink(dOutput, next);
  });
});
