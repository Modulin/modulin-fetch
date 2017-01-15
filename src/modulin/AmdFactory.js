class AmdModule {
  constructor({id, dependencies, factory}) {
    this.id = id;
    this.dependencies = dependencies;

    if (typeof factory === 'function') {
      this.exports = {};
      this.factory = factory;
    } else {
      this.exports = factory;
      this.factory = ()=>{}
    }
  }
}

export default class AmdFactory {
  createLoader(dependencyRepository) {
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
          id: "UNKNOWN",
          dependencies: [],
          factory: id
        };
      }
      else if (id.constructor.name === 'Array') {
        return {
          id: "UNKNOWN",
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
}