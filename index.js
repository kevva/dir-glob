'use strict';
const fs = require('fs');
const path = require('path');
const arrify = require('arrify');
const pify = require('pify');

module.exports = (input, opts) => {
	opts = opts || {};

	if (Array.isArray(opts.ext)) {
		opts.ext = `*.{${opts.ext.join(',')}}`;
	} else if (opts.ext) {
		opts.ext = `*.${opts.ext}`;
	}

	return Promise.all(arrify(input).map(x => {
		return pify(fs.stat)(x[0] === '!' ? x.slice(1) : x).then(stats => {
			if (stats.isDirectory()) {
				return path.join(x, '**', opts.ext || '');
			}

			return x;
		}).catch(err => {
			if (err.code === 'ENOENT') {
				return x;
			}

			throw err;
		});
	}));
};

module.exports.sync = function (input, opts) {
	opts = opts || {};

	if (Array.isArray(opts.ext)) {
		opts.ext = `*.{${opts.ext.join(',')}}`;
	} else if (opts.ext) {
		opts.ext = `*.${opts.ext}`;
	}

	return input.map(x => {
		try {
			const stats = fs.statSync(x[0] === '!' ? x.substring(1) : x);

			if (stats.isDirectory()) {
				return path.join(x, '**', opts.ext || '');
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
