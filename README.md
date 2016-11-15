# whisper.json

A streaming interface that accepts a text stream representing JSON and
encrypts/decrypts it based on the given type.

## Install
```sh
npm i -g whisper.json
```

## Usage

### CLI

```sh
# encrypt configs
cat my-unencrypted-config.json | whisper --secret-file path/to/my/key --encrypt > encrypted-config.json
# decrypt configs
cat encrypted-config.json | whisper --secret-file path/to/my/key --decrypt > decrypted.json
```

### Module

```js
var fs = require('fs');
var Whisper = require('whisper.json');
var secret = fs.readFileSync('some/secret.key', 'utf8');

var encrypt = new Whisper('encrypt', { secret });
fs.createReadStream('some/config.json')
  .pipe(encrypt)
  .pipe(fs.createWriteStream('some/encrypted-config.json'));


var decrypt = new Whisper('decrypt', { secret });
fs.createReadStream('some/encrypted-config.json')
  .pipe(decrypt)
  .pipe(process.stdout);
```


## Tests
```sh
npm test
```
