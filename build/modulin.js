class AmdDependencyRepository {
  constructor({scriptLoader, dependencyResolver}) {
    this.scriptLoader = scriptLoader;
    this.dependencyResolver = dependencyResolver;

    this.loadingModuleIds = [];
    this.pendingModules = [];
    this.resolvedModules = [{id: 'exports'}];
  }

  register(module) {
    const unresolvedDependencies = this.getUnresolvedDependencies(module.dependencies);
    if(unresolvedDependencies.length === 0) {
      this.pendingModules.push(module);

      this.dependencyResolver.resolve({
        pendingModules: this.pendingModules,
        modules: this.resolvedModules
      });

      this.detectCircularReferences();
      return;
    }

    const unloadedDependencies = this.getUnloadedDependencies(unresolvedDependencies);
    if ( unloadedDependencies.length === 0 ) {
      this.pendingModules.push(module);
      this.detectCircularReferences();
      return;
    }

    unloadedDependencies.forEach(path=>{
      const id = path;
      this.loadingModuleIds.push(path);
      this.scriptLoader
        .load(`${path}.js`, id)
        .then((script) => {
          const index = this.loadingModuleIds.indexOf(path);
          index !== -1 && this.loadingModuleIds.splice(index, 1);
          script.execute();
        });
    });
    this.pendingModules.push(module);
    this.detectCircularReferences();
  }

  detectCircularReferences() {
    if( this.loadingModuleIds.length === 0 && this.pendingModules.length > 0) {
      console.log('Possible circular dependency', this.pendingModules);
    }
  }

  getUnloadedDependencies(dependencies) {
    return dependencies.filter(
      dependency => !this.pendingModules.find(
        pendingModule => dependency === pendingModule.id )
      && !this.loadingModuleIds.find(
        loadingModuleId => dependency === loadingModuleId )
    );
  }

  getUnresolvedDependencies(dependencies) {
    return dependencies.filter(
      dependency => !this.resolvedModules.find(
        resolvedModule => dependency === resolvedModule.id )
    );
  }
}class AmdDependencyResolver {
  resolve({pendingModules, modules}) {

    for(let i = 0; i < pendingModules.length; i++){
      const module = pendingModules[i];

      if(this.hasMetDependencies(module, modules)) {
        const exports = module.factory(...this.getDependencies(module, modules));
        if(exports)
          module.exports = exports;

        modules.push(module);
        pendingModules.splice(i, 1);
        i = -1;
      }
    }
  }

  implicitDependencies(dependency, module) {
    switch(dependency) {
      case 'exports':
        return module.exports;
    }
  }

  dependencyToModule(module , modules) {
    return (dep => this.implicitDependencies(dep, module) || modules.find(module => dep === module.id));
  }

  getDependencies(module, modules) {
    return module.dependencies.map(this.dependencyToModule(module, modules));
  }

  hasMetDependencies(module, modules) {
    return module.dependencies.every(this.dependencyToModule(module, modules));
  }
}class AmdModule {
  constructor({id, dependencies, factory}) {
    this.id = id;
    this.dependencies = dependencies;

    if (typeof factory === 'function') {
      this.exports = {};
      this.factory = factory;
    } else {
      this.exports = factory;
      this.factory = ()=>{}
    }
  }
}

class AmdFactory {
  createLoader(dependencyRepository) {
    define.amd = {};
    return define;

    function define(id, dependencies, factory) {
      const normalizedInput = normalizeInput(id, dependencies, factory);
      const module = new AmdModule(normalizedInput);
      dependencyRepository.register(module);
    }

    function normalizeInput(id, dependencies, factory) {
      if (typeof id === 'function' || id.constructor.name === 'Object') {
        return {
          id: define.__scriptSource,
          dependencies: [],
          factory: id
        };
      }
      else if (id.constructor.name === 'Array') {
        return {
          id: define.__scriptSource,
          dependencies: id,
          factory: dependencies
        };
      } else {
        return {
          id: id,
          dependencies: dependencies,
          factory: factory
        };
      }
    }
  }
}class ExportGeneratorAmd {
  constructor(){ }

  generate(exportStatements) {
    const exportMappings = exportStatements
      .map(statement=>this.formatImportMembers(statement.members))
      .join(';\n  ');

    return {
      exportMappings
    }
  }

  formatImportMembers(members) {
    return members.map( member =>this.formatImportMember(member)).join(';');
  }

  formatImportMember(member){
    const name = member.name;
    const alias = member.alias || name;

    switch(member.type) {
      case "mapped":
        return `exports['${alias}'] = ${name};`;
      default:
        return '';
    }
  }

}class ExportParser {

  constructor(){
    this.tokenizer = new ExportTokenizer();
  }

  parse(script, {exports}){
    const [partialScript, lines] = this.extractLines(script);
    exports.push(...this.tokenizeLines(lines));

    return partialScript;
  }

  extractLines(script){
    const lines = [];

    const variableDeclarationRe = /^\s*export\s+((?:let|var|const)\s+)/gm;
    const variableDeclarationScript = script.replace(variableDeclarationRe, (line, variable) =>{
      const type = 'variableDeclaration';
      lines.push({type, line});
      return variable;
    });

    const predeclaredVariableRe = /^\s*export\s+(?:{[\w\s,]*}|\*)[^\n]*\n?/gm;
    const preDeclaredVariableScript = variableDeclarationScript.replace(predeclaredVariableRe, line =>{
      const type = 'preDeclaredVariable';
      lines.push({type, line});
      return '';
    });

    const expressionRe = /^\s*export\s+(default\s+)?([\w{(]+)(?:\s+([\w]+))?/gm;
    const exporessionScript = preDeclaredVariableScript.replace(expressionRe, (line, isDefault, expression, name) =>{
      if(isDefault) {
        return `exports['default'] = ${expression}`;
      } else {
        const alias = name;
        return `exports['${alias}'] = ${expression}`;
      }

    });

    return [exporessionScript, lines];
  }

  tokenizeLines(lines){
    return lines.map((line)=>this.tokenize(line));
  }

  tokenize({type, line}){
    switch(type){
      case 'variableDeclaration':
        debugger;
        return new ExportStatement({
          type: 'variable',
          // members: properties.members.map((member)=>new ExportMember(member)),
          // module: properties.module,
          // moduleIsString: properties.moduleIsString
        });
      case 'preDeclaredVariable':
        let properties;
        properties = this.tokenizer.preDeclaredVariables(line);

        return new ExportStatement({
          type: 'mapped',
          members: properties.members.map((member)=>new ExportMember(member)),
          module: properties.module,
          moduleIsString: properties.moduleIsString
        });
    }

  }

}

class ExportMember {
  constructor({name, alias, type}){
    this.name = name;
    this.alias = alias;
    this.type = type;
  }
}

class ExportStatement {
  constructor({type, members, module, moduleIsString}){
    this.type = type;
    this.members = members;
    this.module = module;
    this.moduleIsString = moduleIsString;
  }
}class ExportTokenizer {
  /**
   * export {name [as alias], ...}|* [from module|from "module-name"]
   * @param line
   * @returns {*}
   */
  preDeclaredVariables(line) {
    const defaultMemberRe = /^\s*export\s+\{(?:([\s\w,]*)|(\*))}(?:\s+from\s+(["'])?([\w\-/]+)\3)?\s*;?\s*$\n?/;
    const matchResult = line.match(defaultMemberRe);

    if(!matchResult)
      throw "";

    const module =  matchResult[4];
    const moduleIsString = !!matchResult[3];
    const allMembers = !!matchResult[2];
    const members = matchResult[1]
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));

    return {members, allMembers, module, moduleIsString};
  }

}class ImportGeneratorAmd {
  constructor(){
    this.counter = 0;
  }

  generate(importStatements) {
    const processedImportStatements = importStatements.map(statement => ({id: statement.id || this.generateId(), statement}));

    const dependencies = processedImportStatements
      .map(s=>s.statement.moduleName)
      .map(moduleName=>`"${moduleName}"`)
      .join(',');

    const dependencyNames = processedImportStatements
      .map(s=>s.id)
      .join(',');

    const mappedDependencies = processedImportStatements
      .map(({id, statement})=>this.formatImportMembers(id, statement.members))
      .filter(TokenizerUtils.filterEmpty)
      .join(';\n  ');

    return {
      dependencyList: `[${dependencies}]`,
      dependencyArguments: dependencyNames,
      dependencyMappings: mappedDependencies
    }
  }

  generateId() {
    return `__DEP${++this.counter}`
  }

  formatImportMembers(id, members) {
    return members.map((member)=>this.formatImportMember(id, member)).join(';');
  }

  formatImportMember(id, member){
    const name = member.name;
    const alias = member.alias || name;

    switch(member.type) {
      case "default":
        return `var ${alias} = ${id}.exports["default"]`;
      case "all":
        return `var ${alias} = ${id}.exports`;
      case "mapped":
        return `var ${alias} = ${id}.exports["${name}"]`;
      default:
        return '';
    }
  }
}class ImportParser {

  constructor(){
    this.tokenizer = new ImportTokenizer();
  }

  parse(script, {imports}){
    const [partialScript, lines] = this.extractLines(script);
    imports.push(...this.tokenizeLines(lines));

    return partialScript;
  }

  extractLines(script){
    const importRe = /^import [\s\w"-{}]*?;\s*$\n?/gm;
    const lines = [];
    const partialScript = script.replace(importRe, (line)=>{
      lines.push(line);
      return '';
    });
    return [partialScript, lines];
  }

  tokenizeLines(lines){
    return lines.map((line)=>this.tokenize(line));
  }

  tokenize(line){
    const defaultMember = this.tokenizer.defaultMember(line);
    const moduleName = this.tokenizer.module(line);
    const globMember = this.tokenizer.globMember(line);
    const mappedMembers = this.tokenizer.mappedMembers(line);
    const members = [defaultMember, globMember, ...mappedMembers]
      .filter((it)=>this.filterEmpty(it))
      .map((member)=>new ImportMember(member));

    return new ImportStatement({moduleName, members});
  }

  filterEmpty(obj){
    return !!obj.name;
  }

}

class ImportMember {
  constructor({name, alias, type}){
    this.name = name;
    this.alias = alias;
    this.type = type;
  }
}

class ImportStatement {
  constructor({id, moduleName, members}){
    this.moduleName = moduleName;
    this.members = members;
    this.id = id;
  }
}class ImportTokenizer {
  defaultMember(line) {
    const type = 'default';
    const defaultMemberRe = /^\s*import\s+(\w+)/;
    const matchResult = line.match(defaultMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  module(line) {
    const moduleRe = /(?:from\s+)?(["'])([\w/-]+)\1\s*;?\s*$/;
    const matchResult = line.match(moduleRe);
    const moduleName = matchResult
      ? matchResult[2]
      : null;

    return moduleName;
  }

  globMember(line) {
    const type = 'all';
    const globMemberRe = /\*\s+as\s+(\w+)\s+from/;
    const matchResult = line.match(globMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  mappedMembers(line) {
    const moduleRe = /{([\w\s,]*)}/;
    const matchResult = line.match(moduleRe);
    const mappedMemberMatch = matchResult
      ? matchResult[1]
      : '';

    return mappedMemberMatch
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));
  }

}class Modulin {

  constructor({importParser, exportParser, wrapperGenerator, dependencyRepositoryFactory, loaderFactory}){
    this.importParser = importParser;
    this.exportParser = exportParser;
    this.wrapperGenerator = wrapperGenerator;
    this.dependencyRepositoryFactory = dependencyRepositoryFactory;
    this.loaderFactory = loaderFactory;

    this.defautImports = [
      new ImportStatement({moduleName: 'exports', id: 'exports', members: [] })
    ];
    this.defaultExports = [];
  }

  getScriptInterceptor(){
    return this.intercept.bind(this);
  }

  intercept(script){
    const importsExports = {imports : [...this.defautImports], exports: [...this.defaultExports]};

    const scriptImportsFormatted = this.importParser.parse(script, importsExports);
    const scriptExportsFormatted = this.exportParser.parse(scriptImportsFormatted, importsExports);

    return this.wrapperGenerator.wrap(scriptExportsFormatted, importsExports.imports, importsExports.exports);
  }

  createLoader(basePath) {

    const dependencyRepository = this.dependencyRepositoryFactory({
      intercept: this.getScriptInterceptor(),
      basePath: basePath
    });

    return this.loaderFactory.createLoader(dependencyRepository);
  }
}class Request {
  constructor({method="GET", url}={}) {
    return new Promise((resolve, reject)=>{
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open(method, url);
      xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState == 4){
          if (xmlhttp.status == 200) {
            resolve(xmlhttp.responseText);
          } else {
            reject(xmlhttp.responseText);
          }
        }
      };
      xmlhttp.send();
    });
  }
}class ScriptLoader {
  constructor({basePath, intercept}={}){
    this.basePath = basePath;
    this.intercept = intercept;
  }

  load(path, id) {
    const url = `${this.basePath}${path}`;
    return new Request({url})
      .then(source=>new Script(this.intercept(source), url, id));
  }
}

class Script {

  constructor(source, url, id) {
    this.id = id;
    this.url = url;
    this.source = source;
  }

  execute() {
    const origin = document.location.origin;
    const url = `${origin}/${this.url}`;
    const source = `define.__scriptSource = "${this.id}"; ${this.source}\n//# sourceURL=${url}`;
    eval(source);
  }

}

class TokenizerUtils {
  static splitMemberAndAlias(string){
    const splitRe = /\s+as\s+/g;
    const type = 'mapped';
    const [name, alias] = string
      .split(splitRe)
      .map(trim);

    return {name, alias, type};

    function trim(str){
      return str.trim();
    }
  }

  static filterEmpty(str){
    return !!str.trim();
  }
}class WrapperGeneratorAmd {

  constructor({importGenerator, exportGenerator}){
    this.importGenerator = importGenerator;
    this.exportGenerator = exportGenerator;
  }

  wrap(script, imports, exports) {
    const {dependencyList, dependencyArguments, dependencyMappings} = this.importGenerator.generate(imports);
    const {exportMappings} = this.exportGenerator.generate(exports);

    return `define(${dependencyList}, function(${dependencyArguments}){ ${dependencyMappings}\n${script}\n${exportMappings}\n});`;
  }
}var modulin = new Modulin({
  importParser: new ImportParser(),
  exportParser: new ExportParser(),
  loaderFactory: new AmdFactory(),
  wrapperGenerator: new WrapperGeneratorAmd({
    importGenerator: new ImportGeneratorAmd(),
    exportGenerator: new ExportGeneratorAmd()
  }),
  dependencyRepositoryFactory: ({intercept, basePath})=> new AmdDependencyRepository({
    scriptLoader: new ScriptLoader({
      intercept,
      basePath
    }),
    dependencyResolver: new AmdDependencyResolver()
  })
});