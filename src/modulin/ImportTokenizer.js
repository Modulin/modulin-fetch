import TokenizerUtils from "./TokenizerUtils";

export default class ImportTokenizer {
  defaultMember(line) {
    const type = 'default';
    const defaultMemberRe = /^\s*import\s+(\w+)/;
    const matchResult = line.match(defaultMemberRe);
    const name = matchResult
      ? matchResult[1]
      : null;

    return {name, type};
  }

  module(line, script) {
    const moduleRe = /(?:from\s+)?(["'])([\w/\-.]+)\1\s*;?\s*$/;
    const matchResult = line.match(moduleRe);
    const moduleName = matchResult
      ? TokenizerUtils.resolveRelativePath(script.path, matchResult[2])
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
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));
  }

}