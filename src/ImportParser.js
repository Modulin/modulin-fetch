class ImportParser {

  constructor(){
    this.tokenizer = new Tokenizer();
  }

  parse(script){
    const [partialScript, lines] = this.extractLines(script);
    const imports = this.tokenizeLines(lines);

    return [partialScript, imports];
  }

  extractLines(script){
    const importRe = /^import [\s\w"-{}]*?;\s*$\n?/gm;
    const lines = [];
    const partialScript = script.replace(importRe, (line)=>{
      lines.push(line);
      return '';
    });
    return [partialScript, lines];
  }

  tokenizeLines(lines){
    return lines.map((line)=>this.tokenize(line));
  }

  tokenize(line){
    const defaultMember = this.tokenizer.defaultMember(line);
    const moduleName = this.tokenizer.module(line);
    const globMember = this.tokenizer.globMember(line);
    const mappedMembers = this.tokenizer.mappedMembers(line);
    const members = [defaultMember, globMember, ...mappedMembers]
      .filter((it)=>this.filterEmpty(it))
      .map((member)=>new ImportMember(member));

    return new ImportStatement({moduleName, members});
  }

  filterEmpty(obj){
    return !!obj.name;
  }

}

class ImportMember {
  constructor({name, alias, type}){
    this.name = name;
    this.alias = alias;
    this.type = type;
  }
}

class ImportStatement {
  constructor({moduleName, members}){
    this.moduleName = moduleName;
    this.members = members;
  }
}