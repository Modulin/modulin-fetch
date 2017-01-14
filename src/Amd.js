class AmdModule {
  constructor({id, dependencies, factory}) {
    this.id = id;
    this.dependencies = dependencies;
    this.exports = [];

    if (typeof factory === 'function') {
      this.factory = factory;
    } else {
      this.exports['default'] = factory;
      this.factory = ()=>{}
    }
  }
}

function generateDefine(dependencyRepository) {
  define.amd = {};
  return define;

  function define(id, dependencies, factory) {
    const normalizedInput = normalizeInput(id, dependencies, factory);
    const module = new AmdModule(normalizedInput);
    dependencyRepository.register(module);
  }

  function normalizeInput(id, dependencies, factory) {
    if (typeof id === 'function' || id.constructor.name === 'Object') {
      return {
        id: define.__scriptSource,
        dependencies: [],
        factory: id
      };
    }
    else if (id.constructor.name === 'Array') {
      return {
        id: define.__scriptSource,
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