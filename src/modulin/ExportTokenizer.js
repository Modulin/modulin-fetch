import TokenizerUtils from "./TokenizerUtils";
import ExportStatement from "./ExportStatement";
import ImportStatement from "./ImportStatement";
import ExportMember from "./ExportMember";

export default class ExportTokenizer {

  constructor(exportGenerator, importGenerator){
    this.exportGenerator = exportGenerator;
    this.importGenerator = importGenerator;
  }

  extractExports(script) {
    const exportRe = /^[\t ]*(export[\t ]+[{*\w\d_$][^\n]*);?[\t ]*$/gm;
    const exports = [];
    const imports = [];

    script.source = script.source.replace(exportRe, (line, normalizedLine)=>{
      const {exportStatement, importStatement} = this.replaceExport(normalizedLine, exports);
      exportStatement && exports.push(exportStatement);
      importStatement && imports.push(importStatement);
      return exportStatement.expression || '';
    });

    return {exports, imports};
  }

  replaceExport(line) {
    return this.extractVariableDeclaration(line)
      ||   this.extractPreDeclaredVariables(line)
      ||   this.extractExpression(line)
      ||   this.triggerExtractionError(line);
  }


  extractVariableDeclaration(scriptSource) {
    const variableDeclarationRe = /^export\s+((?:let|var|const)\s+(.+))/;
    const matchResult = scriptSource.match(variableDeclarationRe);
    const [matched, expression, variableString] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const memberDeclarations = this.splitVariableDeclarations(variableString);
      const members = memberDeclarations.map((member)=>new ExportMember(member));
      return {exportStatement: new ExportStatement({members, expression })};
    }
  }

  extractPreDeclaredVariables(scriptSource) {
    const predeclaredVariableRe = /^export\s+(?:\{([\s\w\d_$,]*)}|(\*))(?:\s+from\s+(["'])?([\w\d\-._$/]+)\3)?/;
    const matchResult = scriptSource.match(predeclaredVariableRe);
    const [matched, variableString, allMembers, _, moduleName] = matchResult
      ? matchResult
      : [];

    if(matched) {
      if(moduleName){
        const id = this.importGenerator.generateId();

        let expression;
        if(allMembers){
          expression = this.importGenerator.formatImportMember(id, {type: 'passThroughAll'});
        } else {
          const members = this.splitVariableAliases(variableString);
          members.forEach(module=>module.type = 'passThrough');
          expression = this.importGenerator.formatImportMembers({id, members});
        }

        return {
          importStatement: new ImportStatement({members: [], moduleName, id}),
          exportStatement: new ExportStatement({members: [], moduleName, expression})
        };
      } else {
        const members = [];
        const memberDeclarations = this.splitVariableAliases(variableString);
        const inlineMembers = memberDeclarations.map((member) => new ExportMember(member));
        const expression = inlineMembers.map((member) => this.exportGenerator.formatExportMember(member)).join('');

        return {exportStatement: new ExportStatement({members, expression})};
      }
    }
  }

  extractExpression(scriptSource) {
    const expressionRe = /^export\s+(default\s+)?((function|class)?[\w{(]+(?:\s+([\d_$\w]+))?.*)$/;
    const matchResult = scriptSource.match(expressionRe);
    const [matched, isDefault, fullExpression, isDeclaration, name] = matchResult
      ? matchResult
      : [];

    if(matched) {
      const missingName = !name;
      const immediateDeclaration = isDefault && !isDeclaration;

      let members = [];
      let expression;

      if(immediateDeclaration || missingName) {
        expression = `exports['default'] = ${fullExpression}`;
      } else {
        const type = 'mapped';
        const alias = isDefault ? 'default' : null;

        expression = `${fullExpression}`;
        members.push(new ExportMember({ type, name, alias }));
      }

      return {exportStatement: new ExportStatement({ members, expression })};

    }
  }

  triggerExtractionError(line) {
    throw `Export rewrite failed for line: ${line}`;
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

