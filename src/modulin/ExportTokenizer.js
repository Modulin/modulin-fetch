import TokenizerUtils from "./TokenizerUtils";

export default class ExportTokenizer {

  extractVariableDeclaration(scriptSource, lines) {
    const type = 'variableDeclaration';

    const variableDeclarationRe = /^export\s+((?:let|var|const)\s+[^\n]+)/gm;
    const variableDeclarationSource = scriptSource.replace(variableDeclarationRe, (line, variable) =>{
      lines.push({type, line});
      return variable;
    });

    return variableDeclarationSource;
  }

  extractPreDeclaredVariables(scriptSource, lines) {
    const type = 'preDeclaredVariable';

    const predeclaredVariableRe = /^export\s+(?:{[\w\s,-]*}|\*)[^\n]*/gm;
    const preDeclaredVariableSource = scriptSource.replace(predeclaredVariableRe, line =>{
      lines.push({type, line});
      return '';
    });

    return preDeclaredVariableSource;
  }

  extractExpression(scriptSource, lines) {

    const expressionRe = /^export\s+(default\s+)?(((function|class)?[\w{(]+)(?:\s+([\w]+))?)/gm;
    const exporessionSource = scriptSource.replace(expressionRe, (line, isDefault, fullExpression, expression, isDeclaration, name) =>{
      const type = isDefault
        ? 'defaultExpression'
        : 'expression';

      const immediateDeclaration = isDefault && !isDeclaration;
      const missingName = !name;

      if(immediateDeclaration || missingName) {
        return `exports['default'] = ${fullExpression}`;
      } else {
        lines.push({type, name});
        return `${fullExpression}`;
      }
    });

    return exporessionSource;
  }

  validateScriptSource(scriptSource) {
    const allRe = /^export[\t ].*$/gm;
    const validatedSource = scriptSource.replace(allRe, (line)=>{ throw `Invalid export: ${line}`; });

    return validatedSource;
  }

  replaceExport(line, exports) {
    let processingSource = line;
    processingSource = this.extractVariableDeclaration(processingSource, exports);
    processingSource = this.extractPreDeclaredVariables(processingSource, exports);
    processingSource = this.extractExpression(processingSource, exports);
    processingSource = this.validateScriptSource(processingSource, exports);

    return processingSource;
  }

  extractExports(script) {
    const exportRe = /^[\t ]*(export[\t ]*[{*\w][^\n]*);?[\t ]*$/gm;
    const exports = [];

    script.source = script.source.replace(exportRe, (line, normalizedLine)=>{
      const exportStatement = this.replaceExport(normalizedLine, exports);
      return exportStatement;
    });

    return exports;
  }

  /**
   * export {name [as alias], ...}|* [from module|from "module-name"]
   * @param line
   * @returns {*}
   */
  preDeclaredVariables(line) {
    const defaultMemberRe = /^\s*export\s+\{(?:([\s\w,]*)|(\*))}(?:\s+from\s+(["'])?([\w\-/]+)\3)?\s*;?\s*$/;
    const matchResult = line.match(defaultMemberRe);

    if(!matchResult)
      throw "";

    const module =  matchResult[4];
    const moduleIsString = !!matchResult[3];
    const allMembers = !!matchResult[2];
    const members = matchResult[1]
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));

    return {members, allMembers, module, moduleIsString};
  }

  variableDeclaration(line) {
    const variableDeclarationRe = /^\s*export\s+\w+\s+([^\n]+);/;
    const matchResult = line.match(variableDeclarationRe);

    if(!matchResult)
      throw "";

    const members = matchResult[1]
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitVariableAndValue(match));

    return {members};
  }

}