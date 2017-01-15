import {ImportStatement} from "./ImportParser"

export default class Modulin {

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

  intercept(script) {
    const module = {
      script,
      imports: [...this.defautImports],
      exports: [...this.defaultExports]
    };

    this.importParser.rewrite(module);
    this.exportParser.rewrite(module);
    this.wrapperGenerator.wrap(module);

    return script;
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