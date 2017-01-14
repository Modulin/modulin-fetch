class AmdDependencyResolver {
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
}