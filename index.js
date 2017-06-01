'use strict';
const path = require('path');
const arrify = require('arrify');
const isDirectory = require('is-directory');
const pify = require('pify');

const getGlob = (fp, ext) => path.join(fp, '**', ext || '');
const getExt = ext => Array.isArray(ext) ? `*.{${ext.join(',')}}` : `*.${ext}`;
const getPath = fp => fp[0] === '!' ? fp.slice(1) : fp;

module.exports = (input, opts) => {
	opts = opts || {};

	if (opts.ext) {
		opts.ext = getExt(opts.ext);
	}

	return Promise.all(arrify(input).map(x => pify(isDirectory)(getPath(x))
		.then(isDir => isDir ? getGlob(x, opts.ext) : x)));
};

module.exports.sync = (input, opts) => {
	opts = opts || {};

	if (opts.ext) {
		opts.ext = getExt(opts.ext);
	}

	return input.map(x => isDirectory.sync(getPath(x)) ? getGlob(x, opts.ext) : x);
};
