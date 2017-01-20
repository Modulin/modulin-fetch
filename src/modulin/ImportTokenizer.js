import TokenizerUtils from "./TokenizerUtils";
import ImportStatement from "./ImportStatement";

export default class ImportTokenizer {

  constructor(importGenerator) {
    this.importGenerator = importGenerator;
  }

  extractImports(script) {
    const importRe = /^[\t ]*(import [\t \w"'-{}._]*?)[\t ]*;?[\t ]*$/gm;
    const imports = [];

    script.source = script.source.replace(importRe, (line, normalizedLine)=>{
      const importStatement = this.replaceImport(normalizedLine, {path: script.path});
      imports.push(importStatement);
      return this.importGenerator.formatImportMembers(importStatement);
    });

    return imports;
  }

  replaceImport(line, script) {
    const id = this.importGenerator.generateId();

    const defaultMember = this.defaultMember(line);
    const moduleName = this.module(line, script);
    const globMember = this.globMember(line);
    const mappedMembers = this.mappedMembers(line);
    const members = [defaultMember, globMember, ...mappedMembers]
      .filter((it)=>this.filterEmpty(it))
      .map((member)=>new ImportMember(member));

    return new ImportStatement({id, moduleName, members});
  }


  defaultMember(line) {
    const type = 'default';
    const defaultMemberRe = /^import\s+(\w+)/;
    const matchResult = line.match(defaultMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  module(line, script) {
    const moduleRe = /(?:from\s+)?(["'])([\w/\-._]+)\1$/;
    const matchResult = line.match(moduleRe);
    const moduleName = matchResult
      ? TokenizerUtils.resolveRelativePath(script.path, matchResult[2])
      : null;

    return moduleName;
  }

  globMember(line) {
    const type = 'all';
    const globMemberRe = /^import\s+\*\s+as\s+(\w+)/;
    const matchResult = line.match(globMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  mappedMembers(line) {
    const moduleRe = /^import\s+\{([\w\s,]*)}/;
    const matchResult = line.match(moduleRe);
    const mappedMemberMatch = matchResult
      ? matchResult[1]
      : '';

    return mappedMemberMatch
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));
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