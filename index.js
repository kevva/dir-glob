'use strict';
const fs = require('fs');
const path = require('path');
const arrify = require('arrify');
const pify = require('pify');

const isDir = fp => pify(fs.stat)(fp).then(stats => stats.isDirectory());
const getGlob = (fp, ext) => path.join(fp, '**', ext || '');
const getExt = ext => Array.isArray(ext) ? `*.{${ext.join(',')}}` : `*.${ext}`;
const getPath = fp => fp[0] === '!' ? fp.slice(1) : fp;

module.exports = (input, opts) => {
	opts = opts || {};

	if (opts.ext) {
		opts.ext = getExt(opts.ext);
	}

	return Promise.all(arrify(input).map(x => isDir(getPath(x))
		.then(isDir => isDir ? getGlob(x, opts.ext) : x)
		.catch(err => {
			if (err.code === 'ENOENT') {
				return x;
			}

			throw err;
		})
	));
};

module.exports.sync = function (input, opts) {
	opts = opts || {};

	if (opts.ext) {
		opts.ext = getExt(opts.ext);
	}

	return input.map(x => {
		try {
			const stats = fs.statSync(getPath(x));

			if (stats.isDirectory()) {
				return getGlob(x, opts.ext);
			}

			return x;
		} catch (err) {
			if (err.code === 'ENOENT') {
				return x;
			}

			throw err;
		}
	});
};
