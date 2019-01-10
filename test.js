import del from 'del';
import makeDir from 'make-dir';
import test from 'ava';
import m from '.';

test.before(() => makeDir.sync('tmp/inner_tmp'));
test.after(() => del.sync('tmp'));

test('convert directories to glob - async', async t => {
	t.deepEqual(await m('tmp'), ['tmp/**']);
	t.deepEqual(await m(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(await m(['index.js', 'tmp'], {extensions: ['js']}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(await m(['index.js', 'tmp'], {extensions: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(await m(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(await m(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(await m(['index.js', '!tmp'], {extensions: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
	t.deepEqual(await m(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js']}), ['index.js', 'tmp/**/unicorn.js', 'tmp/**/*.png']);
	t.deepEqual(await m(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/unicorn.{js,png}', 'tmp/**/*.png']);
	t.deepEqual(await m(['index.js', 'tmp'], {files: ['test', 'unicorn'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/test.{js,png}', 'tmp/**/unicorn.{js,png}']);
	t.deepEqual(await m('inner_tmp', {cwd: 'tmp'}), ['inner_tmp/**']);
	t.deepEqual(await m(['index.js', 'inner_tmp'], {cwd: 'tmp'}), ['index.js', 'inner_tmp/**']);
	t.deepEqual(await m(['index.js', 'inner_tmp'], {cwd: 'tmp', files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'inner_tmp/**/unicorn.{js,png}', 'inner_tmp/**/*.png']);
	await t.throws(m(['index.js'], {cwd: undefined}), 'Expected `cwd` to be of type `string` but received type `undefined`');
});

test('convert directories to glob - sync', t => {
	t.deepEqual(m.sync('tmp'), ['tmp/**']);
	t.deepEqual(m.sync(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {extensions: ['js']}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {extensions: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(m.sync(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(m.sync(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(m.sync(['index.js', '!tmp'], {extensions: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js']}), ['index.js', 'tmp/**/unicorn.js', 'tmp/**/*.png']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/unicorn.{js,png}', 'tmp/**/*.png']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {files: ['test', 'unicorn'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/test.{js,png}', 'tmp/**/unicorn.{js,png}']);
	t.deepEqual(m.sync('inner_tmp', {cwd: 'tmp'}), ['inner_tmp/**']);
	t.deepEqual(m.sync(['index.js', 'inner_tmp'], {cwd: 'tmp'}), ['index.js', 'inner_tmp/**']);
	t.deepEqual(m.sync(['index.js', 'inner_tmp'], {cwd: 'tmp', files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'inner_tmp/**/unicorn.{js,png}', 'inner_tmp/**/*.png']);
	t.throws(() => m.sync(['index.js'], {cwd: undefined}), 'Expected `cwd` to be of type `string` but received type `undefined`');
});
