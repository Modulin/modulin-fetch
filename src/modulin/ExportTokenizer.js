import TokenizerUtils from "./TokenizerUtils";
import ExportStatement from "./ExportStatement";

export default class ExportTokenizer {

  constructor(exportGenerator){
    this.exportGenerator = exportGenerator;
  }

  extractVariableDeclaration(scriptSource) {
    const type = 'mapped';
    const variableDeclarationRe = /^export\s+((?:let|var|const)\s+(.+))/;
    const matchResult = scriptSource.match(variableDeclarationRe);
    const [matched, expression, variableString] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const memberDeclarations = this.splitVariableDeclarations(variableString);
      const members = memberDeclarations.map((member)=>new ExportMember(member));
      return new ExportStatement({ type, members, expression });
    }
  }

  extractPreDeclaredVariables(scriptSource) {
    const type = 'resolved';
    const predeclaredVariableRe = /^export\s+\{(?:([\s\w,]*)|(\*))}(?:\s+from\s+(["'])?([\w\-/]+)\3)?/;
    const matchResult = scriptSource.match(predeclaredVariableRe);
    const [matched, variableString, allMembers, moduleIsString, module] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const members = [];
      const memberDeclarations = this.splitVariableAliases(variableString);
      const inlineMembers = memberDeclarations.map((member)=>new ExportMember(member));
      const expression = inlineMembers.map((member)=>this.exportGenerator.formatImportMember(member)).join('');
      return new ExportStatement({ type, members, expression, module, moduleIsString});
    }
  }

  extractExpression(scriptSource) {
    const expressionRe = /^export\s+(default\s+)?((function|class)?[\w{(]+(?:\s+([\w]+))?.*)$/;
    const matchResult = scriptSource.match(expressionRe);
    const [matched, isDefault, fullExpression, isDeclaration, name] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const missingName = !name;
      const immediateDeclaration = isDefault && !isDeclaration;

      let type;
      let members = [];
      let expression;

      if(immediateDeclaration || missingName) {
        type = 'resolved';
        expression = `exports['default'] = ${fullExpression}`;
      } else {
        const alias = isDefault ? 'default' : null;

        type = 'mapped';
        expression = `${fullExpression}`;
        members.push(new ExportMember({ type, name, alias }));
      }

      return new ExportStatement({ type, members, expression });

    }
  }

  triggerExtractionError(line) {
    throw `Export rewrite failed for line: ${line}`;
  }

  replaceExport(line) {
    return this.extractVariableDeclaration(line)
      ||   this.extractPreDeclaredVariables(line)
      ||   this.extractExpression(line)
      ||   this.triggerExtractionError(line);
  }

  extractExports(script) {
    const exportRe = /^[\t ]*(export[\t ]*[{*\w][^\n]*);?[\t ]*$/gm;
    const exports = [];

    script.source = script.source.replace(exportRe, (line, normalizedLine)=>{
      const exportStatement = this.replaceExport(normalizedLine, exports);
      exports.push(exportStatement);
      return exportStatement.expression || '';
    });

    return exports;
  }


  splitVariableAliases(variableString) {
    const members = variableString
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitMemberAndAlias(match));

    return members;
  }

  splitVariableDeclarations(variableString) {
    const members = variableString
      .split(',')
      .filter((it)=>TokenizerUtils.filterEmpty(it))
      .map((match)=>TokenizerUtils.splitVariableAndValue(match));

    return members;
  }

}

class ExportMember {
  constructor({name, alias, type}){
    this.name = name;
    this.alias = alias;
    this.type = type;
  }
}