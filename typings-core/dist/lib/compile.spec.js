"use strict";
var test = require("blue-tape");
var nock = require("nock");
var path_1 = require("path");
var events_1 = require("events");
var compile_1 = require("./compile");
var config_1 = require("../utils/config");
var dependencies_1 = require("./dependencies");
var FIXTURES_DIR = path_1.join(__dirname, '__test__/fixtures');
test('compile', function (t) {
    t.test('fixtures', function (t) {
        t.test('compile a normal definition', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile');
            var root = {
                src: path_1.join(FIXTURE_DIR, config_1.CONFIG_FILE),
                main: 'root',
                raw: undefined,
                postmessage: undefined,
                global: false,
                browser: {
                    'b/b': 'browser'
                },
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var a = {
                src: path_1.join(FIXTURE_DIR, "a/" + config_1.CONFIG_FILE),
                main: undefined,
                raw: undefined,
                postmessage: undefined,
                global: false,
                typings: 'typed.d.ts',
                browserTypings: 'typed.browser.d.ts',
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var b = {
                src: path_1.join(FIXTURE_DIR, 'bower.json'),
                main: undefined,
                raw: undefined,
                postmessage: undefined,
                global: false,
                typings: 'typings/b.d.ts',
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var browser = {
                src: path_1.join(FIXTURE_DIR, 'package.json'),
                main: undefined,
                raw: undefined,
                postmessage: undefined,
                global: false,
                typings: 'browser.d.ts',
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var dep = {
                src: path_1.join(FIXTURE_DIR, "dep/" + config_1.CONFIG_FILE),
                main: 'dep/main.d.ts',
                raw: undefined,
                postmessage: undefined,
                global: false,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            root.dependencies.a = a;
            root.dependencies['b/b'] = b;
            root.dependencies.browser = browser;
            a.dependencies.dep = dep;
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(root, ['main', 'browser'], { name: 'root', cwd: __dirname, global: false, meta: true, emitter: emitter })
                .then(function (out) {
                t.equal(out.results.main, [
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/dep/path.d.ts",
                    'declare module \'~root~a~dep/path\' {',
                    'export const isDep: boolean',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/a/typed.d.ts",
                    'declare module \'~root~a/typed\' {',
                    'import { isDep } from \'~root~a~dep/path\'',
                    '',
                    'export interface ITest {',
                    '  foo: string',
                    '  bar: boolean',
                    '}',
                    '',
                    'export default function (): ITest',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/typings/b.d.ts",
                    'declare module \'~root~b/b/typings/b\' {',
                    'export const foo: number',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/root.import.d.ts",
                    'declare module \'~root/root.import\' {',
                    'export const test: string',
                    '}',
                    'declare module \'root/root.import\' {',
                    'export * from \'~root/root.import\';',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/root.d.ts",
                    'declare module \'~root/root\' {',
                    'import a from \'~root~a/typed\'',
                    'import b = require(\'~root~b/b/typings/b\')',
                    'export * from \'~root/root.import\'',
                    'export default a',
                    '}',
                    'declare module \'root/root\' {',
                    'export * from \'~root/root\';',
                    'export { default } from \'~root/root\';',
                    '}',
                    'declare module \'root\' {',
                    'export * from \'~root/root\';',
                    'export { default } from \'~root/root\';',
                    '}',
                    ''
                ].join('\n'));
                t.equal(out.results.browser, [
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/a/typed.browser.d.ts",
                    'declare module \'~root~a/typed.browser\' {',
                    'export function browser (): boolean',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/browser.d.ts",
                    'declare module \'~root~browser/browser\' {',
                    'export const bar: boolean',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/root.import.d.ts",
                    'declare module \'~root/root.import\' {',
                    'export const test: string',
                    '}',
                    'declare module \'root/root.import\' {',
                    'export * from \'~root/root.import\';',
                    '}',
                    '',
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile/root.d.ts",
                    'declare module \'~root/root\' {',
                    'import a from \'~root~a/typed.browser\'',
                    'import b = require(\'~root~browser/browser\')',
                    'export * from \'~root/root.import\'',
                    'export default a',
                    '}',
                    'declare module \'root/root\' {',
                    'export * from \'~root/root\';',
                    'export { default } from \'~root/root\';',
                    '}',
                    'declare module \'root\' {',
                    'export * from \'~root/root\';',
                    'export { default } from \'~root/root\';',
                    '}',
                    ''
                ].join('\n'));
            });
        });
        t.test('compile export equals', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-export-equals');
            var file = {
                src: path_1.join(FIXTURE_DIR, config_1.CONFIG_FILE),
                main: 'file.d.ts',
                raw: undefined,
                postmessage: undefined,
                global: false,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(file, ['main', 'browser'], { name: 'foobar', cwd: __dirname, global: false, meta: false, emitter: emitter })
                .then(function (out) {
                t.equal(out.results.main, [
                    'declare module \'foobar\' {',
                    'function foo (value: string): foo.Bar;',
                    '',
                    'module foo {',
                    '  export interface Bar {',
                    '    (message: any, ...args: any[]): void;',
                    '    enabled: boolean;',
                    '    namespace: string;',
                    '  }',
                    '}',
                    '',
                    'export = foo;',
                    '}',
                    ''
                ].join('\n'));
                t.equal(out.results.main, out.results.browser);
            });
        });
        t.test('compile export default', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-export-default');
            var file = {
                src: path_1.join(FIXTURE_DIR, config_1.CONFIG_FILE),
                main: 'index.d.ts',
                raw: undefined,
                postmessage: undefined,
                global: false,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(file, ['main'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
                .then(function (out) {
                t.equal(out.results.main, [
                    'declare module \'test\' {',
                    'const foo: string;',
                    '',
                    'export default foo;',
                    '}',
                    ''
                ].join('\n'));
            });
        });
        t.test('compile duplicate files from different import contexts', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-dep-dupe');
            var root = {
                src: path_1.join(FIXTURE_DIR, config_1.CONFIG_FILE),
                main: 'index.d.ts',
                raw: undefined,
                postmessage: undefined,
                global: false,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var foo = {
                src: path_1.join(FIXTURE_DIR, 'foo', config_1.CONFIG_FILE),
                main: 'index.d.ts',
                parent: root,
                raw: undefined,
                postmessage: undefined,
                global: false,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            root.dependencies.foo = foo;
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(root, ['main'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
                .then(function (out) {
                t.equal(out.results.main, [
                    'declare module \'~test~foo/x\' {',
                    'import * as bar from \'~test~foo/index\'',
                    '',
                    'export { bar }',
                    '}',
                    '',
                    'declare module \'~test~foo/index\' {',
                    'export * from \'~test~foo/x\'',
                    '}',
                    '',
                    'declare module \'test\' {',
                    'import * as x from \'~test~foo/x\'',
                    'export * from \'~test~foo/index\'',
                    '}',
                    ''
                ].join('\n'));
            });
        });
        t.test('compile module augmentation', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-module-augmentation');
            var file = {
                src: path_1.join(FIXTURE_DIR, config_1.CONFIG_FILE),
                main: 'index.d.ts',
                raw: undefined,
                postmessage: undefined,
                global: false,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(file, ['main'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
                .then(function (out) {
                t.equal(out.results.main, [
                    'declare module \'~test/import\' {',
                    'function main (): boolean;',
                    '',
                    'export { main }',
                    '}',
                    'declare module \'test/import\' {',
                    'export * from \'~test/import\';',
                    '}',
                    '',
                    'declare module \'~test/index\' {',
                    'import * as imported from \'~test/import\'',
                    '',
                    'module \'~test/import\' {',
                    '  namespace main {',
                    '    export function augmented (): boolean;',
                    '  }',
                    '}',
                    '',
                    'export { imported }',
                    '}',
                    'declare module \'test/index\' {',
                    'export * from \'~test/index\';',
                    '}',
                    'declare module \'test\' {',
                    'export * from \'~test/index\';',
                    '}',
                    ''
                ].join('\n'));
            });
        });
        t.test('compile a global definition', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-global');
            var node = {
                src: __filename,
                raw: undefined,
                postmessage: undefined,
                global: true,
                typings: path_1.join(FIXTURE_DIR, 'node.d.ts'),
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var fs = {
                src: path_1.join(FIXTURE_DIR, 'fs.d.ts'),
                main: undefined,
                raw: undefined,
                postmessage: undefined,
                global: false,
                typings: path_1.join(FIXTURE_DIR, 'fs.d.ts'),
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            node.dependencies.fs = fs;
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(node, ['main'], { name: 'node', cwd: __dirname, global: true, meta: false, emitter: emitter })
                .then(function (out) {
                t.equal(out.results.main, [
                    'declare module \'fs\' {',
                    'export function readFileSync (path: string, encoding: string): string',
                    'export function readFileSync (path: string): Buffer',
                    '}',
                    '',
                    'declare var __dirname: string',
                    ''
                ].join('\n'));
            });
        });
        t.test('compile inline global definitions', function (t) {
            var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-inline-global');
            var typings = path_1.join(FIXTURE_DIR, 'node.d.ts');
            var node = {
                src: __filename,
                raw: undefined,
                postmessage: undefined,
                global: true,
                typings: typings,
                dependencies: {},
                devDependencies: {},
                peerDependencies: {},
                globalDependencies: {},
                globalDevDependencies: {}
            };
            var emitter = new events_1.EventEmitter();
            return compile_1.compile(node, ['main', 'browser'], { name: 'name', cwd: __dirname, global: true, meta: true, emitter: emitter })
                .then(function (out) {
                var contents = [
                    "// Generated by typings",
                    "// Source: __test__/fixtures/compile-inline-global/node.d.ts",
                    'declare const require: (module: string) => any;',
                    '',
                    'declare module "events" {',
                    '\texport const test: boolean;',
                    '}',
                    '',
                    'declare module "fs" {',
                    '\timport * as events from "events";',
                    '}',
                    ''
                ].join('\n');
                t.equal(out.results.main, contents);
                t.equal(out.results.main, out.results.browser);
            });
        });
    });
    t.test('missing error', function (t) {
        var node = {
            src: 'http://example.com/typings/typings.json',
            raw: undefined,
            postmessage: undefined,
            global: false,
            typings: 'http://example.com/typings/index.d.ts',
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        t.plan(1);
        return compile_1.compile(node, ['main'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .catch(function (result) {
            t.equal(result.message, 'Unable to read typings for "test". You should check the entry paths in "typings.json" are up to date');
        });
    });
    t.test('global flag compile error', function (t) {
        var node = {
            src: 'http://example.com/typings.json',
            raw: undefined,
            postmessage: undefined,
            global: true,
            typings: 'http://example.com/index.d.ts',
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        t.plan(1);
        return compile_1.compile(node, ['main'], { name: 'name', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .catch(function (result) {
            t.equal(result.message, 'Unable to compile "name", the typings are meant to be installed as global ' +
                'but attempted to be compiled as an external module');
        });
    });
    t.test('global compile error', function (t) {
        var node = {
            src: path_1.join(__dirname, '__test__/fixtures/compile-global/node.d.ts'),
            raw: undefined,
            postmessage: undefined,
            global: false,
            main: path_1.join(__dirname, '__test__/fixtures/compile-global/node.d.ts'),
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        t.plan(1);
        return compile_1.compile(node, ['main'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .catch(function (result) {
            t.equal(result.message, 'Attempted to compile "test" as an external module, ' +
                'but it looks like a global module. ' +
                'You\'ll need to enable the global option to continue.');
        });
    });
    t.test('external compile error', function (t) {
        var node = {
            src: path_1.join(__dirname, '__test__/fixtures/compile/root.d.ts'),
            raw: undefined,
            postmessage: undefined,
            global: true,
            main: path_1.join(__dirname, '__test__/fixtures/compile/root.d.ts'),
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        t.plan(1);
        return compile_1.compile(node, ['main'], { name: 'test', cwd: __dirname, global: true, meta: false, emitter: emitter })
            .catch(function (result) {
            t.equal(result.message, 'Attempted to compile "test" as a global module, ' +
                'but it looks like an external module. ' +
                'You\'ll need to remove the global option to continue.');
        });
    });
    t.test('no main or typings error', function (t) {
        var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'main-resolve-error');
        var main = {
            src: path_1.join(FIXTURE_DIR, 'package.json'),
            raw: undefined,
            postmessage: undefined,
            global: false,
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        t.plan(1);
        return compile_1.compile(main, ['main'], { name: 'main', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .catch(function (error) {
            t.ok(/^Unable to read typings for "main"/.test(error.message));
        });
    });
    t.test('no module dts file error', function (t) {
        var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'node-resolve-error');
        var main = {
            src: path_1.join(FIXTURE_DIR, 'package.json'),
            main: 'index.js',
            raw: undefined,
            postmessage: undefined,
            global: false,
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var dependency = {
            main: 'index.js',
            raw: undefined,
            postmessage: undefined,
            global: false,
            src: path_1.join(FIXTURE_DIR, 'node_modules/test/package.json'),
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        main.dependencies.test = dependency;
        t.plan(1);
        return compile_1.compile(main, ['main'], { name: 'main', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .catch(function (error) {
            t.ok(/^Unable to read typings for "test"/.test(error.message));
        });
    });
    t.test('override dependency with local file', function (t) {
        var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-module-file-override');
        var emitter = new events_1.EventEmitter();
        return dependencies_1.resolveNpmDependencies({ cwd: FIXTURE_DIR, dev: false, emitter: emitter })
            .then(function (tree) {
            return compile_1.compile(tree, ['browser'], { name: 'main', cwd: __dirname, global: false, meta: false, emitter: emitter });
        })
            .then(function (out) {
            t.equal(out.results.browser, [
                'declare module \'~main/override\' {',
                'function test (): string;',
                '',
                'export = test;',
                '}',
                'declare module \'main/override\' {',
                'import main = require(\'~main/override\');',
                'export = main;',
                '}',
                '',
                'declare module \'main\' {',
                'import * as foo from \'~main/override\'',
                '',
                'export = foo',
                '}',
                ''
            ].join('\n'));
        });
    });
    t.test('resolve and compile local file override with dependency', function (t) {
        var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-file-module-override');
        var emitter = new events_1.EventEmitter();
        return dependencies_1.resolveNpmDependencies({ cwd: FIXTURE_DIR, dev: false, emitter: emitter })
            .then(function (tree) {
            return compile_1.compile(tree, ['main', 'browser'], { name: 'main', cwd: __dirname, global: false, meta: false, emitter: emitter });
        })
            .then(function (out) {
            t.equal(out.results.main, [
                'declare module \'~main/imported/index\' {',
                'export function isNotDep (): boolean;',
                '}',
                'declare module \'main/imported/index\' {',
                'export * from \'~main/imported/index\';',
                '}',
                '',
                'declare module \'~main/index\' {',
                'export * from \'~main/imported/index\'',
                '}',
                'declare module \'main/index\' {',
                'export * from \'~main/index\';',
                '}',
                'declare module \'main\' {',
                'export * from \'~main/index\';',
                '}',
                ''
            ].join('\n'));
            t.equal(out.results.browser, [
                'declare module \'~main~dep/index\' {',
                'export function isDep (): boolean;',
                '}',
                '',
                'declare module \'~main/index\' {',
                'export * from \'~main~dep/index\'',
                '}',
                'declare module \'main/index\' {',
                'export * from \'~main/index\';',
                '}',
                'declare module \'main\' {',
                'export * from \'~main/index\';',
                '}',
                ''
            ].join('\n'));
        });
    });
    t.test('resolve over http', function (t) {
        var node = {
            src: 'http://example.com/typings.json',
            raw: undefined,
            postmessage: undefined,
            global: false,
            main: 'http://example.com/index.d.ts?query=test',
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        nock('http://example.com')
            .get('/index.d.ts?query=test')
            .matchHeader('User-Agent', /^typings\/\d+\.\d+\.\d+ node\/v\d+\.\d+\.\d+.*$/)
            .reply(200, 'export * from "./test"');
        nock('http://example.com')
            .get('/test?query=test')
            .reply(404);
        nock('http://example.com')
            .get('/test.d.ts?query=test')
            .reply(200, 'export const test: boolean');
        return compile_1.compile(node, ['main'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .then(function (out) {
            t.equal(out.results.main, [
                'declare module \'~test/test\' {',
                'export const test: boolean',
                '}',
                'declare module \'test/test\' {',
                'export * from \'~test/test\';',
                '}',
                '',
                'declare module \'~test/index\' {',
                'export * from \'~test/test\'',
                '}',
                'declare module \'test/index\' {',
                'export * from \'~test/index\';',
                '}',
                'declare module \'test\' {',
                'export * from \'~test/index\';',
                '}',
                ''
            ].join('\n'));
        });
    });
    t.test('resolve files array', function (t) {
        var FIXTURE_DIR = path_1.join(FIXTURES_DIR, 'compile-files-array');
        var tree = {
            src: path_1.join(FIXTURE_DIR, 'typings.json'),
            raw: undefined,
            postmessage: undefined,
            global: false,
            files: ['a.d.ts', 'b.d.ts'],
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            globalDependencies: {},
            globalDevDependencies: {}
        };
        var emitter = new events_1.EventEmitter();
        return compile_1.compile(tree, ['main', 'browser'], { name: 'test', cwd: __dirname, global: false, meta: false, emitter: emitter })
            .then(function (out) {
            t.equal(out.results.main, [
                'declare module \'~test/a\' {',
                'export const a: boolean;',
                '}',
                'declare module \'test/a\' {',
                'export * from \'~test/a\';',
                '}',
                '',
                'declare module \'~test/b\' {',
                'export const b: boolean;',
                '}',
                'declare module \'test/b\' {',
                'export * from \'~test/b\';',
                '}',
                ''
            ].join('\n'));
            t.equal(out.results.main, out.results.browser);
        });
    });
});
//# sourceMappingURL=compile.spec.js.map