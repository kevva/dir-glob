import makeDir from 'make-dir';
import rimraf from 'rimraf';
import test from 'ava';
import m from '.';

test.before(() => makeDir.sync('tmp'));
test.after(() => rimraf.sync('tmp'));

test('convert directories to glob - async', async t => {
	t.deepEqual(await m(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(await m(['index.js', 'tmp'], {ext: 'js'}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(await m(['index.js', 'tmp'], {ext: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(await m(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(await m(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(await m(['index.js', '!tmp'], {ext: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
});

test('convert directories to glob - sync', t => {
	t.deepEqual(m.sync(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {ext: 'js'}), ['index.js', 'tmp/**/*.js']);
	t.deepEqual(m.sync(['index.js', 'tmp'], {ext: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.deepEqual(m.sync(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
	t.deepEqual(m.sync(['index.js', '!tmp']), ['index.js', '!tmp/**']);
	t.deepEqual(m.sync(['index.js', '!tmp'], {ext: ['js', 'png']}), ['index.js', '!tmp/**/*.{js,png}']);
});
