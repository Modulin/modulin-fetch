export default class ImportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  rewrite({script, imports}){
    const lines = this.tokenizer.extractImports(script);
    imports.push(...this.tokenizeLines(lines, script));
  }

  tokenizeLines(lines, script){
    return lines.map((line)=>this.tokenize(line.line, script));
  }

  tokenize(line, script){
    const defaultMember = this.tokenizer.defaultMember(line);
    const moduleName = this.tokenizer.module(line, script);
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

export class ImportStatement {
  constructor({id, moduleName, members}){
    this.moduleName = moduleName;
    this.members = members;
    this.id = id;
  }
}