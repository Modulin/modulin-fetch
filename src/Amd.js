class AmdModule {
  constructor({id, dependencies, factory}) {
    this.id = id;
    this.dependencies = dependencies;
    this.exports = [];

    if (typeof factory === 'function') {
      this.factory = factory;
    } else {
      this.exports['default'] = factory;
    }
  }
}

class AmdDependencyResolver {
  resolve(moduleToResolve, availableModules) {

  }
}

class AmdDependencyManager {
  constructor({scriptLoader, dependencyResolver}) {
    this.scriptLoader = scriptLoader;
    this.dependencyResolver = dependencyResolver;

    this.loadingModulePaths = [];
    this.pendingModules = [];
    this.resolvedModules = [];
  }

  register(module) {
    const unresolvedDependencies = this.getUnresolvedDependencies(module.dependencies);
    if(unresolvedDependencies.length === 0) {
      this.dependencyResolver.resolve(module, this.resolvedModules);
      this.resolvedModules.push(module);
      return;
    }

    const unloadedDependencies = this.getUnloadedDependencies(unresolvedDependencies);
    if ( unloadedDependencies.length === 0 ) {
      this.pendingModules.push(module);
      return;
    }

    unloadedDependencies.forEach(path=>{
      this.loadingModulePaths.push(path);
      this.scriptLoader.load(`${path}.js`);
    });
    this.pendingModules.push(module);
  }

  getUnloadedDependencies(dependencies) {
    return dependencies.filter(
      dependency => !this.pendingModules.find(
          pendingModule => dependency.id === pendingModule.id )
        && !this.loadingModulePaths.find(
          loadingModulePath => dependency.id === loadingModulePath )
    );
  }

  getUnresolvedDependencies(dependencies) {
    return dependencies.filter(
      dependency => !this.resolvedModules.find(
          resolvedModule => dependency.id === resolvedModule.id )
    );
  }
}

function generateDefine(dependencyManager) {
  define.amd = {};
  return define;

  function define(id, dependencies, factory) {
    const normalizedInput = normalizeInput(id, dependencies, factory);
    const module = new AmdModule(normalizedInput);
    dependencyManager.register(module);
  }

  function normalizeInput(id, dependencies, factory) {
    if (typeof id === 'function' || id.constructor.name === 'Object') {
      return {
        id: null,
        dependencies: [],
        factory: id
      };
    }
    else if (id.constructor.name === 'Array') {
      return {
        id: null,
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