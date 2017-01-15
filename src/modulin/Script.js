export default class Script {

  constructor(source, url, id) {
    this.id = id;
    this.path = id.replace(/[^/]*$/, '');
    this.url = url;
    this.source = source;
  }

  execute() {
    eval(this.source);
  }

}