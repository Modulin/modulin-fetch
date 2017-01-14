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
      if(this.loadingModuleIds.indexOf(path) === -1) {
        this.loadingModuleIds.push(path);
        this.scriptLoader
          .load(`${path}.js`, id)
          .then((script) => {
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
}