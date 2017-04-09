"use strict";
var test = require("blue-tape");
var path_1 = require("path");
var bundle_1 = require("./bundle");
var fs_1 = require("./utils/fs");
var events_1 = require("events");
var emitter = new events_1.EventEmitter();
test('bundle', function (t) {
    t.test('bundle everything', function (t) {
        var FIXTURE_DIR = path_1.join(__dirname, '__test__/bundle');
        return fs_1.rimraf(path_1.join(FIXTURE_DIR, 'out'))
            .then(function () {
            return bundle_1.bundle({
                cwd: FIXTURE_DIR,
                name: 'example',
                out: path_1.join(FIXTURE_DIR, 'out', 'bundle.d.ts'),
                global: false,
                emitter: emitter
            });
        })
            .then(function () {
            return fs_1.readFile(path_1.join(FIXTURE_DIR, 'out', 'bundle.d.ts'), 'utf8');
        })
            .then(function (contents) {
            t.equal(contents, [
                "// Generated by typings",
                "// Source: custom_typings/test.d.ts",
                "declare module '~example~test/test' {",
                "export function test (): string;",
                "}",
                "",
                "// Generated by typings",
                "// Source: index.d.ts",
                "declare module 'example' {",
                "export { test } from '~example~test/test'",
                "}",
                ''
            ].join('\n'));
        });
    });
});
//# sourceMappingURL=bundle.spec.js.map