# modulin
A light weight javascript browser import polyfill

The project was started after some rebelling of all the tooling which is required today to setup a minial development environment. It currently supports a large subset of the different types of import/export statements but does not follow the standard for live variables. (A description can be found at http://exploringjs.com/es6/ch_modules.html)

It provides a minimal transpiler for import/export statements using regular expressions which limits it's power but the solution has proven easy to work with. Behind the scenes it transpiles to amd module and a minimal module loader is bundled with the transpiler.
