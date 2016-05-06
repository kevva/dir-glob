# dir-glob [![Build Status](https://travis-ci.org/kevva/dir-glob.svg?branch=master)](https://travis-ci.org/kevva/dir-glob)

> Convert directories to glob compatible strings


## Install

```
$ npm install --save dir-glob
```


## Usage

```js
const dirGlob = require('dir-glob');

dirGlob(['index.js', 'test.js', 'fixtures']).then(files => {
	console.log(files);
	//=> ['index.js', 'test.js', 'fixtures/**']
});

dirGlob(['lib/**', 'fixtures'], {ext: 'js'}).then(files => {
	console.log(files);
	//=> ['lib/**', 'fixtures/**/*.js']
});

dirGlob(['lib/**', 'fixtures'], {ext: ['js', 'png']}).then(files => {
	console.log(files);
	//=> ['lib/**', 'fixtures/**/*.{js,png}']
});
```


## API

### dirGlob(input, [options])

Returns a promise for an array of glob strings.

#### input

Type: `array`, `string`

A `string` or an `array` of paths.

#### options

##### ext

Type: `array` , `string`

Append extension to the end of your glob.

### dirGlob.sync(input, [options])

Returns an array of glob strings.

#### input

Type: `array`, `string`

A `string` or an `array` of paths.

#### options

##### ext

Type: `array`, `string`

Append extension to the end of your glob.


## License

MIT © [Kevin Martensson](http://github.com/kevva)
