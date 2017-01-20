<p align="center"><a><img width="102"src="https://github.com/RikardLegge/modulin/blob/master/resources/logo.png"></a></p>

# Modulin


__IMPORTANT! This is a work in progress and does not currently follow the ES6 nor the AmdJS specs. Only ment to be used in development environments__

Modulin was created after some rebelling of all the tooling which is required today to setup a minial development environment. Thats is why the project does NOT ship a javascrip parser and does NOT hold an AST (Abstract syntax tree) of the code. It currently supports a large subset of the ES6 import/export statements but is limited by what type of syntax is parsable when using regular expressions and what kind of variable manipulation can be executed safely without having an AST. 

A minimal transpiler for ES6 import/export statements is provided using regular expressions which limits it's power but the solution has proven easy to work with. Behind the scenes it transpiles each file into an amd module and loads the module using a bundeled module loader.

A demo of the hello-world.html in action can be found [here](https://www.legge.se/modulin/hello-world.html "legge.se") (Should work in most browsers)

A demo of modulin loading it's own source can be found [here](https://www.legge.se/modulin/test-load-self.html "legge.se") (Chrome 54+ is recomended since the source consists of non transpiled ES6 code)

## Compatibility

### Browser
- [X] IE9+
- [X] Chrome 11+
- [X] Fire fox 4+

### ES6 
- [x] Named, aliased and glob imports
- [x] Named, aliased and glob exports
- [ ] Live variables
- [ ] Line breaks in import statements
- [ ] Line breaks in export statements

### AmdJS
- [x] Named modules
- [x] Non cyclic dependency resolving
- [ ] Cyclic dependency resolving
- [ ] Auto detect filenames

## Supported backends
* [AmdJS](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 
