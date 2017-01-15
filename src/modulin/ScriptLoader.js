import Script from "./Script";

export default class ScriptLoader {
  constructor({basePath, intercept, fetch}){
    this.basePath = basePath;
    this.intercept = intercept;
    this.fetch = fetch;
  }

  load(path, id) {
    const url = `${this.basePath}${path}`;
    return this.fetch(url)
      .then(source=>this.intercept(new Script(source, url, id)));
  }
}



