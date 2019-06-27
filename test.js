import del from 'del';
import makeDir from 'make-dir';
import test from 'ava';
import dirGlob from '.';

test.before(() => {
	makeDir.sync('tmp/inner_tmp');
});

test.after(() => {
	del.sync('tmp');
});

test('convert directories to glob - async', async t => {
	t.deepEqual(await dirGlob('tmp'), ['tmp/**']);
	t.deepEqual(await dirGlob(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(await dirGlob(['index.js', 'tmp'], {extensions: ['js']}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(await dirGlob(['index.js', 'tmp'], {extensions: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(await dirGlob(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(await dirGlob(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(await dirGlob(['index.js', '!tmp'], {extensions: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
	t.deepEqual(await dirGlob(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js']}), ['index.js', 'tmp/**/unicorn.js', 'tmp/**/*.png']);
	t.deepEqual(await dirGlob(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/unicorn.{js,png}', 'tmp/**/*.png']);
	t.deepEqual(await dirGlob(['index.js', 'tmp'], {files: ['test', 'unicorn'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/test.{js,png}', 'tmp/**/unicorn.{js,png}']);
	t.deepEqual(await dirGlob('inner_tmp', {cwd: 'tmp'}), ['inner_tmp/**']);
	t.deepEqual(await dirGlob(['index.js', 'inner_tmp'], {cwd: 'tmp'}), ['index.js', 'inner_tmp/**']);
	t.deepEqual(await dirGlob(['index.js', 'inner_tmp'], {cwd: 'tmp', files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'inner_tmp/**/unicorn.{js,png}', 'inner_tmp/**/*.png']);
	t.deepEqual(await dirGlob([__dirname], {extensions: ['js']}), [`${__dirname}/**/*.js`]);
	t.deepEqual(await dirGlob([__dirname], {files: ['*.js']}), [`${__dirname}/**/*.js`]);
	await t.throwsAsync(dirGlob(['index.js'], {cwd: undefined}), 'Expected `cwd` to be of type `string` but received type `undefined`');
});

test('convert directories to glob - sync', t => {
	t.deepEqual(dirGlob.sync('tmp'), ['tmp/**']);
	t.deepEqual(dirGlob.sync(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(dirGlob.sync(['index.js', 'tmp'], {extensions: ['js']}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(dirGlob.sync(['index.js', 'tmp'], {extensions: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(dirGlob.sync(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(dirGlob.sync(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(dirGlob.sync(['index.js', '!tmp'], {extensions: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
	t.deepEqual(dirGlob.sync(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js']}), ['index.js', 'tmp/**/unicorn.js', 'tmp/**/*.png']);
	t.deepEqual(dirGlob.sync(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/unicorn.{js,png}', 'tmp/**/*.png']);
	t.deepEqual(dirGlob.sync(['index.js', 'tmp'], {files: ['test', 'unicorn'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/test.{js,png}', 'tmp/**/unicorn.{js,png}']);
	t.deepEqual(dirGlob.sync('inner_tmp', {cwd: 'tmp'}), ['inner_tmp/**']);
	t.deepEqual(dirGlob.sync(['index.js', 'inner_tmp'], {cwd: 'tmp'}), ['index.js', 'inner_tmp/**']);
	t.deepEqual(dirGlob.sync(['index.js', 'inner_tmp'], {cwd: 'tmp', files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'inner_tmp/**/unicorn.{js,png}', 'inner_tmp/**/*.png']);
	t.deepEqual(dirGlob.sync([__dirname], {extensions: ['js']}), [`${__dirname}/**/*.js`]);
	t.deepEqual(dirGlob.sync([__dirname], {files: ['*.js']}), [`${__dirname}/**/*.js`]);
	t.throws(() => {
		dirGlob.sync(['index.js'], {cwd: undefined});
	}, 'Expected `cwd` to be of type `string` but received type `undefined`');
});
