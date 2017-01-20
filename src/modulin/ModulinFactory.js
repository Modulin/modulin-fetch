export default class ModulinFactory {

  constructor({importParser, exportParser, wrapperGenerator, dependencyRepositoryFactory, loaderFactory, temporaryLoaderFactory}){
    this.importParser = importParser;
    this.exportParser = exportParser;
    this.wrapperGenerator = wrapperGenerator;
    this.dependencyRepositoryFactory = dependencyRepositoryFactory;
    this.loaderFactory = loaderFactory;
    this.temporaryLoaderFactory = temporaryLoaderFactory;
  }

  getScriptInterceptor(){
    return this.intercept.bind(this);
  }

  intercept(script) {
    const module = {
      script,
      imports: [],
      exports: []
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

    const define = this.loaderFactory.createLoader(dependencyRepository);
    this.temporaryLoaderFactory.setInstance(define);
    return define;
  }

  load(basePath, module) {
    const define = this.createLoader(basePath);
    define([module], {});
  }
}