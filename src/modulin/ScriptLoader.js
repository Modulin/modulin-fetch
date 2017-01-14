import Request from "./Request";

export default class ScriptLoader {
  constructor({basePath, intercept}={}){
    this.basePath = basePath;
    this.intercept = intercept;
  }

  load(path, id) {
    const url = `${this.basePath}${path}`;
    return new Request({url})
      .then(source=>new Script(this.intercept(source, url, id), url, id));
  }
}

class Script {

  constructor(source, url, id) {
    this.id = id;
    this.url = url;
    this.source = source;
  }

  execute() {
    eval(this.source);
  }

}

