<p align="center"><a><img width="102"src="https://github.com/RikardLegge/modulin/blob/master/resources/logo.png"></a></p>

# Modulin


__IMPORTANT! This is a work in progress and does not currently follow the ES6 nor the AmdJS specs.__

A light weight javascript browser import polyfill with swappable backends.

Modulin was created after some rebelling of all the tooling which is required today to setup a minial development environment. It currently supports a large subset of the ES6 import/export statements but does not follow the standards for live variables. (A description of live variables can be found at http://exploringjs.com/es6/ch_modules.html)

A minimal transpiler for ES6 import/export statements is provided using regular expressions which limits it's power but the solution has proven easy to work with. Behind the scenes it transpiles each file into a (amd/...) module and loaded by a bundled module loader.

## Supported backends
* [AmdJS](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 
