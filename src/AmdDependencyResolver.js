class AmdDependencyResolver {
  resolve({pendingModules, modules}) {

    for(let i = 0; i < pendingModules.length; i++){
      const module = pendingModules[i];

      if(this.hasMetDependencies(module, modules)) {
        module.factory(...this.getDependencies(module, modules));
        modules.push(module);
        pendingModules.splice(i, 1);
        i = -1;
      }
    }
  }

  dependencyToModule(modules) {
    return dep => modules.find(module => dep === module.id);
  }

  getDependencies(module, modules) {
    return module.dependencies.map(this.dependencyToModule(modules));
  }

  hasMetDependencies(module, modules) {
    return module.dependencies.every(this.dependencyToModule(modules));
  }
}