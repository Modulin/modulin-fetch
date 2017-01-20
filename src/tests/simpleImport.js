import {a} from './simpleExport';
assert(a === "a");

import {a} from '../tests/simpleExport';
assert(a === "a");

import {a} from '/tests/simpleExport';
assert(a === "a");

import simpleExportDefault from '/tests/simpleExport';
assert(simpleExportDefault === "b");

import {a as b} from '/tests/simpleExport';
assert(b === "a");

import * as SimpleExport from '/tests/simpleExport';
assert(SimpleExport.a === "a");
assert(SimpleExport.b === "c");

import {b as c} from '/tests/simpleExport';
assert(c === "c");

import {d, e} from '/tests/simpleExport';
assert(typeof d === 'function');
assert(typeof e === 'function');

import {i, j} from '/tests/simpleExport';
assert(i === 'i');
assert(j === 'j');

import {y, z} from '/tests/simpleExport';
assert(y === 10);
assert(z === 10);

console.log("Simple import tests complete");

function assert(expression, message) {
  if(!expression) {
    const error = new Error(`Assertion failed${message ? `(${message})` : ''}`);
    throw error;
  }
}