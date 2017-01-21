export default class AmdDependencyRepository {
  constructor({loadScript, dependencyResolver}) {
    this.loadScript = loadScript;
    this.dependencyResolver = dependencyResolver;

    this.loadingModuleIds = [];
    this.pendingModules = [];
    this.failedModules = [];
    this.resolvedModules = [{id: 'exports'}];
  }

  register(module) {
    const unresolvedDependencies = this.getUnresolvedDependencies(module.dependencies);
    if(unresolvedDependencies.length === 0) {
      this.pendingModules.push(module);

      this.dependencyResolver.resolve({
        failedModules: this.failedModules,
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
      if(this.loadingModuleIds.indexOf(path) === -1) {
        this.loadingModuleIds.push(path);

        this.loadScript(path).then((script) => {
          const index = this.loadingModuleIds.indexOf(path);
          index !== -1 && this.loadingModuleIds.splice(index, 1);
          script.execute();
        });
      }
    });
    this.pendingModules.push(module);
    this.detectCircularReferences();
  }

  detectCircularReferences() {
    if (
      this.failedModules.length === 0 &&
      this.loadingModuleIds.length === 0 &&
      this.pendingModules.length > 0
    ) {
      console.log('Possible circular dependencies', this.pendingModules);
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
}