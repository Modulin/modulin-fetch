import TokenizerUtils from "./TokenizerUtils";

export default class ImportTokenizer {
  extractImports(script) {
    const importRe = /^[\t ]*(import [\t \w"'-{}._]*?)[\t ]*;?[\t ]*$/gm;
    const lines = [];

    script.source = script.source.replace(importRe, (line, normalizedLine)=>{
      lines.push({line: normalizedLine});
      return '';
    });

    return lines;
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

}