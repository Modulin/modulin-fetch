export default class ImportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  rewrite({script, imports}){
    imports.push(...this.tokenizer.extractImports(script));
  }

}