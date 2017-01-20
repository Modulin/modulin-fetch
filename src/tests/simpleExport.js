
const a = "a";
const b = "b";
const c = "c";

export {a, c as b}

export default class {}
export default function() {}

export default b;
export function d(){ }
export class e { }

export let f, g, h;
export let i = 'i', j = 'j';

export * from "tests/simpleExport2";
export {z as y} from "tests/simpleExport2";