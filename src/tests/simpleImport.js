import simpleExportDefault from 'tests/simpleExport';
console.assert(simpleExportDefault === "b");

import {a} from 'tests/simpleExport';
console.assert(a === "a");

import {a as b} from 'tests/simpleExport';
console.assert(b === "a");

import * as SimpleExport from 'tests/simpleExport';
console.assert(SimpleExport.a === "a");
console.assert(SimpleExport.b === "c");

import {b as c} from 'tests/simpleExport';
console.assert(c === "c");

import {d, e} from 'tests/simpleExport';
console.assert(typeof d === 'function');
console.assert(typeof e === 'function');

console.log("Simple import tests complete");