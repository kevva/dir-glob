'use strict';
const path = require('path');
const pathType = require('path-type');

const getExtensions = extensions => extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];
const getPath = (filepath, cwd) => path.join(cwd, filepath[0] === '!' ? filepath.slice(1) : filepath);

const addExtensions = (file, extensions) => {
	if (path.extname(file)) {
		return `**/${file}`;
	}

	return `**/${file}.${getExtensions(extensions)}`;
};

const getGlob = (dir, opts) => {
	if (opts.files && !Array.isArray(opts.files)) {
		throw new TypeError(`\`options.files\` must be an \`Array\`, not \`${typeof opts.files}\``);
	}

	if (opts.extensions && !Array.isArray(opts.extensions)) {
		throw new TypeError(`\`options.extensions\` must be an \`Array\`, not \`${typeof opts.extensions}\``);
	}

	if (opts.files && opts.extensions) {
		return opts.files.map(x => path.join(dir, addExtensions(x, opts.extensions)));
	} else if (opts.files) {
		return opts.files.map(x => path.join(dir, `**/${x}`));
	} else if (opts.extensions) {
		return [path.join(dir, `**/*.${getExtensions(opts.extensions)}`)];
	}

	return [path.join(dir, '**')];
};

module.exports = (input, opts) => {
	opts = Object.assign({cwd: process.cwd()}, opts);

	return Promise.all([].concat(input).map(x => pathType.dir(getPath(x, opts.cwd))
		.then(isDir => isDir ? getGlob(x, opts) : x)))
		.then(globs => [].concat.apply([], globs));
};

module.exports.sync = (input, opts) => {
	opts = Object.assign({cwd: process.cwd()}, opts);

	const globs = [].concat(input).map(x => pathType.dirSync(getPath(x, opts.cwd)) ? getGlob(x, opts) : x);
	return [].concat.apply([], globs);
};
