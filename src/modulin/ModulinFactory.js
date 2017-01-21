export default class ModulinFactory {

  constructor({dependencyRepositoryFactory, loaderFactory, temporaryLoaderFactory}){
    this.dependencyRepositoryFactory = dependencyRepositoryFactory;
    this.loaderFactory = loaderFactory;
    this.temporaryLoaderFactory = temporaryLoaderFactory;
  }

  createLoader(basePath) {

    const dependencyRepository = this.dependencyRepositoryFactory({
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