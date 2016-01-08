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
		return pify(fs.stat, Promise)(el).then(function (stats) {
			if (stats.isDirectory()) {
				return path.join(el, '**', opts.ext || '');
			}

			return el;
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
		var stats = fs.statSync(el);

		if (stats.isDirectory()) {
			return path.join(el, '**', opts.ext || '');
		}

		return el;
	});
};
