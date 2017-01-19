export default class ExportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  rewrite({script, exports}){
    exports.push(...this.tokenizer.extractExports(script));
  }

}