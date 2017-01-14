class Tokenizer {
  defaultMember(line) {
    const type = 'default';
    const defaultMemberRe = /^import\s+(\w+)/;
    const matchResult = line.match(defaultMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  module(line) {
    const moduleRe = /(?:from\s+)?(["'])([\w/-]+)\1;?\s*$/;
    const matchResult = line.match(moduleRe);
    const moduleName = matchResult
      ? matchResult[2]
      : null;

    return moduleName;
  }

  globMember(line) {
    const type = 'all';
    const globMemberRe = /\*\s+as\s+(\w+)\s+from/;
    const matchResult = line.match(globMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  mappedMembers(line) {
    const moduleRe = /{([\w\s,]*)}/;
    const matchResult = line.match(moduleRe);
    const mappedMemberMatch = matchResult
      ? matchResult[1]
      : '';

    return mappedMemberMatch
      .split(',')
      .filter((it)=>this.filterEmpty(it))
      .map((match)=>this.splitMemberAndAlias(match));
  }

  splitMemberAndAlias(string){
    const splitRe = /\s+as\s+/g;
    const type = 'mapped';
    const [name, alias] = string
      .split(splitRe)
      .map(trim);

    return {name, alias, type};

    function trim(str){
      return str.trim();
    }
  }

  filterEmpty(str){
    return !!str.trim();
  }
}