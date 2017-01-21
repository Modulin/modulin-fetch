import Script from "./Script";

export default class ScriptLoader {
  constructor({basePath, scriptInterceptors, fetch}){
    this.basePath = basePath;
    this.scriptInterceptors = scriptInterceptors;
    this.fetch = fetch;
  }

  getFileType(path) {
    const match = path.match(/\.([^./]+)$/);
    return match && this.scriptInterceptors[match[1]]
      ? match[1]
      : 'default';
  }

  getUrl(path) {
    const baseUrl = `${this.basePath}${path}`;
    const fileType = this.getFileType(path);
    return fileType === 'default'
      ? `${baseUrl}.js`
      : `${baseUrl}`
  }

  getInterceptor(path){
    const fileType = this.getFileType(path);
    const defaultInterceptor = this.scriptInterceptors['default'];
    const typeInterceptor = fileType !== 'default' && this.scriptInterceptors[fileType];

    return {intercept: (script)=>{
      typeInterceptor && (script = typeInterceptor.intercept(script));
      script = defaultInterceptor.intercept(script);
      return script;
    }}
  }

  load(path) {
    const fileType = this.getFileType(path);
    const interceptor = this.getInterceptor(path);
    const url = this.getUrl(path);

    if(!interceptor)
      throw new Error(`Interceptor not found for ${fileType}`);

    return this.fetch(url)
      .then(source=>interceptor.intercept(new Script(source, url, path)));
  }
}



