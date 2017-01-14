class ScriptLoader {
  constructor({basePath, intercept}){
    this.basePath = basePath;
    this.intercept = intercept;
  }

  load(path) {
    const url = `${this.basePath}${path}`;
    return new Request({url})
      .then(source=>new Script(this.intercept(source)));
  }
}

class Script {

  constructor(source) {
    this.source = source;
  }

  execute() {
    eval(this.source);
  }

}

