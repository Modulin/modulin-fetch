import {ImportStatement} from "./ImportParser"

export default class Modulin {

  constructor({config={}, importParser, exportParser, wrapperGenerator, dependencyRepositoryFactory, loaderFactory}){
    this.config = config;
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

  intercept(script, url, id) {
    const importsExports = {imports : [...this.defautImports], exports: [...this.defaultExports]};

    const scriptImportsFormatted = this.importParser.parse(script, importsExports, id);
    const scriptExportsFormatted = this.exportParser.parse(scriptImportsFormatted, importsExports, id);

    const wrappedSource = this.wrapperGenerator.wrap(scriptExportsFormatted, importsExports.imports, importsExports.exports);

    const origin = document.location.origin;
    const absUrl = `${origin}/${this.url}`;
    return `define.amd.__scriptSource = "${id}"; ${wrappedSource}\n//# sourceURL=${absUrl}`;
  }

  createLoader(basePath) {

    const dependencyRepository = this.dependencyRepositoryFactory({
      intercept: this.getScriptInterceptor(),
      basePath: basePath
    });

    return this.loaderFactory.createLoader(dependencyRepository);
  }

  load(basePath, module) {
    window.define = this.createLoader(basePath);
    define([module], {});
  }
}