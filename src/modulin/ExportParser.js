export default class ExportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  rewrite({script, exports, imports}){
    const extracted = this.tokenizer.extractExports(script);
    exports.push(...extracted.exports);
    imports.push(...extracted.imports);
  }

}