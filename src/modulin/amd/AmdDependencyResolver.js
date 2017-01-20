export default class AmdDependencyResolver {
  resolve({failedModules, pendingModules, modules}) {

    for(let i = 0; i < pendingModules.length; i++){
      const module = pendingModules[i];

      if(this.hasMetDependencies(module, modules)) {
        pendingModules.splice(i, 1);

        try {
          const exports = module.factory(...this.getDependencies(module, modules));
          if(exports)
            module.exports = exports;

          Object.freeze(module.exports);
          modules.push(module);
        } catch(exception) {
          failedModules.push(module);
          console.error(`Failed to load module ${module.id}`, exception);
        }

        i = -1;
      }
    }
  }

  getDefaultDependency(dependency, module) {
    switch(dependency) {
      case 'exports':
        return module.exports;
    }
  }

  dependencyToModule(module , modules) {
    return (dep => this.getDefaultDependency(dep, module) || modules.find(module => dep === module.id));
  }

  getDependencies(module, modules) {
    return module.dependencies.map(this.dependencyToModule(module, modules));
  }

  hasMetDependencies(module, modules) {
    return module.dependencies.every(this.dependencyToModule(module, modules));
  }
}