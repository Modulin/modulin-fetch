class ExportTokenizer {
  /**
   * export {name [as alias], ...}|* [from module|from "module-name"]
   * @param line
   * @returns {*}
   */
  preDeclaredVariables(line) {
    const defaultMemberRe = /^\s*export\s+\{(?:([\s\w,]*)|(\*))}(?:\s+from\s+(["'])?([\w\-/]+)\3)?\s*;?\s*$\n?/;
    const matchResult = line.match(defaultMemberRe);

    if(!matchResult)
      return null;

    const module =  matchResult[4];
    const moduleIsString = !!matchResult[3];
    const allMembers = !!matchResult[2];
    const members = matchResult[1]
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));

    return {members, allMembers, module, moduleIsString};
  }
}