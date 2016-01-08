import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import test from 'ava';
import m from './';

test.before(() => mkdirp.sync('tmp'));
test.after(() => rimraf.sync('tmp'));

test('convert directories to glob - async', async t => {
	t.same(await m(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.same(await m(['index.js', 'tmp'], {ext: 'js'}), ['index.js', 'tmp/**/*.js']);
	t.same(await m(['index.js', 'tmp'], {ext: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.same(await m(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
});

test('convert directories to glob - sync', t => {
	t.same(m.sync(['index.js', 'tmp']), ['index.js', 'tmp/**']);
	t.same(m.sync(['index.js', 'tmp'], {ext: 'js'}), ['index.js', 'tmp/**/*.js']);
	t.same(m.sync(['index.js', 'tmp'], {ext: ['js', 'png']}), ['index.js', 'tmp/**/*.{js,png}']);
	t.same(m.sync(['foo/**', 'tmp']), ['foo/**', 'tmp/**']);
});
