'use strict';

var fs = require('fs');
var path = require('path');
var Secure = require('secure-keys');
var concat = require('concat-stream');
var duplexify = require('duplexify');
var from = require('from2-string');

module.exports = Whisper;

function Whisper(type, opts) {
  this.type = type;
  this.secure = new Secure(opts);
  this.writable = concat({ encoding: 'string' }, this.process.bind(this));
  this.stream = duplexify(this.writable);

  return this.stream;
}

Whisper.prototype.process = function (data) {
  try {
    data = JSON.parse(data);
    data = this.secure[this.type](data);
  } catch (ex) {
    ex.message = 'Invalid JSON ' + ex.message;
    this.stream.emit('error', ex);
    return;
  }

  this.stream.setReadable(from(JSON.stringify(data, null, 2)));
};



