import TokenizerUtils from "./TokenizerUtils";
import ExportStatement from "./ExportStatement";

export default class ExportTokenizer {

  extractVariableDeclaration(scriptSource) {
    const type = 'variable';
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
    const type = 'mapped';
    const predeclaredVariableRe = /^export\s+\{(?:([\s\w,]*)|(\*))}(?:\s+from\s+(["'])?([\w\-/]+)\3)?/;
    const matchResult = scriptSource.match(predeclaredVariableRe);
    const [matched, variableString, allMembers, moduleIsString, module] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const memberDeclarations = this.splitVariableAliases(variableString);
      const members = memberDeclarations.map((member)=>new ExportMember(member));
      return new ExportStatement({ type, members, module, moduleIsString});
    }
  }

  extractExpression(scriptSource) {
    const expressionRe = /^export\s+(default\s+)?((function|class)?[\w{(]+(?:\s+([\w]+))?.*)$/;
    const matchResult = scriptSource.match(expressionRe);
    const [matched, isDefault, fullExpression, isDeclaration, name] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const immediateDeclaration = isDefault && !isDeclaration;
      const missingName = !name;

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

  replaceExport(line) {
    return this.extractVariableDeclaration(line)
      ||   this.extractPreDeclaredVariables(line)
      ||   this.extractExpression(line);
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