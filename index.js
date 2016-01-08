'use strict';
var fs = require('fs');
var path = require('path');
var arrify = require('arrify');
var pify = require('pify');
var Promise = require('pinkie-promise');

module.exports = function (input, opts) {
	opts = opts || {};

	if (Array.isArray(opts.ext)) {
		opts.ext = '*.{' + opts.ext.join(',') + '}';
	} else if (opts.ext) {
		opts.ext = '*.' + opts.ext;
	}

	return Promise.all(arrify(input).map(function (el) {
		return pify(fs.stat, Promise)(el[0] === '!' ? el.substring(1) : el).then(function (stats) {
			if (stats.isDirectory()) {
				return path.join(el, '**', opts.ext || '');
			}

			return el;
		}).catch(function (err) {
			if (err.code === 'ENOENT') {
				return el;
			}

			throw err;
		});
	}));
};

module.exports.sync = function (input, opts) {
	opts = opts || {};

	if (Array.isArray(opts.ext)) {
		opts.ext = '*.{' + opts.ext.join(',') + '}';
	} else if (opts.ext) {
		opts.ext = '*.' + opts.ext;
	}

	return input.map(function (el) {
		try {
			var stats = fs.statSync(el[0] === '!' ? el.substring(1) : el);

			if (stats.isDirectory()) {
				return path.join(el, '**', opts.ext || '');
			}

			return el;
		} catch (err) {
			if (err.code === 'ENOENT') {
				return el;
			}

			throw err;
		}
	});
};
