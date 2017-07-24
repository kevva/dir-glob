import del from 'del';
import makeDir from 'make-dir';
import test from 'ava';
import m from '.';

test.before(() => makeDir.sync('tmp'));
test.after(() => del.sync('tmp'));

test('convert directories to glob - async', async t => {
	t.deepEqual(await m(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(await m(['index.js', 'tmp'], {extensions: ['js']}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(await m(['index.js', 'tmp'], {extensions: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(await m(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(await m(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(await m(['index.js', '!tmp'], {extensions: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
	t.deepEqual(await m(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js']}), ['index.js', 'tmp/**/unicorn.js', 'tmp/**/*.png']);
	t.deepEqual(await m(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/unicorn.{js,png}', 'tmp/**/*.png']);
	t.deepEqual(await m(['index.js', 'tmp'], {files: ['test', 'unicorn'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/test.{js,png}', 'tmp/**/unicorn.{js,png}']);
});

test('convert directories to glob - sync', t => {
	t.deepEqual(m.sync(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {extensions: ['js']}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {extensions: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(m.sync(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(m.sync(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(m.sync(['index.js', '!tmp'], {extensions: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js']}), ['index.js', 'tmp/**/unicorn.js', 'tmp/**/*.png']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {files: ['unicorn', '*.png'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/unicorn.{js,png}', 'tmp/**/*.png']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {files: ['test', 'unicorn'], extensions: ['js', 'png']}), ['index.js', 'tmp/**/test.{js,png}', 'tmp/**/unicorn.{js,png}']);
});
