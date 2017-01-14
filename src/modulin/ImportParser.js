export default class ImportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  parse(script, {imports}, id){
    const [partialScript, lines] = this.extractLines(script);
    imports.push(...this.tokenizeLines(lines, id));

    return partialScript;
  }

  extractLines(script){
    const importRe = /^import [\t \w"-{}.]*?;?[^\n]*/gm;
    const lines = [];
    const partialScript = script.replace(importRe, (line)=>{
      lines.push(line);
      return '';
    });
    return [partialScript, lines];
  }

  tokenizeLines(lines, id){
    return lines.map((line)=>this.tokenize(line, id));
  }

  tokenize(line, id){
    const path = id.replace(/[^/]*$/, '');
    const defaultMember = this.tokenizer.defaultMember(line);
    const moduleName = this.tokenizer.module(line, path);
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