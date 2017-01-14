class ScriptLoader {
  constructor({basePath, intercept}){
    this.basePath = basePath;
    this.intercept = intercept;
  }

  load(path, id) {
    const url = `${this.basePath}${path}`;
    return new Request({url})
      .then(source=>new Script(this.intercept(source), id));
  }
}

class Script {

  constructor(source, id) {
    this.id = id;
    this.source = source;
  }

  execute() {
    const source = `define.__scriptSource = "${this.id}"; ${this.source}`;
    eval(source);
  }

}

