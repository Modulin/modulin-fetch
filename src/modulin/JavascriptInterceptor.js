export default class JavascriptInterceptor {
  constructor({importParser, exportParser, wrapperGenerator}){
    this.importParser = importParser;
    this.exportParser = exportParser;
    this.wrapperGenerator = wrapperGenerator;
  }

  intercept(script) {
    const module = {
      script,
      imports: [],
      exports: []
    };

    this.importParser.rewrite(module);
    this.exportParser.rewrite(module);
    this.wrapperGenerator.wrap(module);

    return script;
  }
}