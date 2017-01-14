class ExportParser {

  constructor(){
    this.tokenizer = new ExportTokenizer();
  }

  parse(script, {exports}){
    const [partialScript, lines] = this.extractLines(script);
    exports.push(...this.tokenizeLines(lines));

    return partialScript;
  }

  extractLines(script){
    const lines = [];

    const variableDeclarationRe = /^\s*export\s+((?:let|var|const)\s+)/gm;
    const variableDeclarationScript = script.replace(variableDeclarationRe, (line, variable) =>{
      const type = 'variableDeclaration';
      lines.push({type, line});
      return variable;
    });

    const predeclaredVariableRe = /^\s*export\s+(?:{[\w\s,]*}|\*)[^\n]*\n?/gm;
    const preDeclaredVariableScript = variableDeclarationScript.replace(predeclaredVariableRe, line =>{
      const type = 'preDeclaredVariable';
      lines.push({type, line});
      return '';
    });

    const expressionRe = /^\s*export\s+(?:default\s+)?([\w{(]+)/gm;
    const exporessionScript = preDeclaredVariableScript.replace(expressionRe, (line, expression) =>{
      const type = 'expression';
      lines.push({type, line});
      return `var __DEFAULTEXPORT = ${expression}`;
    });

    return [exporessionScript, lines];
  }

  tokenizeLines(lines){
    return lines.map((line)=>this.tokenize(line));
  }

  tokenize({type, line}){
    switch(type){
      case 'variableDeclaration':
        return new ExportStatement({
          type: 'variable',
          // members: properties.members.map((member)=>new ExportMember(member)),
          // module: properties.module,
          // moduleIsString: properties.moduleIsString
        });
      case 'preDeclaredVariable':
        let properties;
        properties = this.tokenizer.preDeclaredVariables(line);

        return new ExportStatement({
          type: 'mapped',
          members: properties.members.map((member)=>new ExportMember(member)),
          module: properties.module,
          moduleIsString: properties.moduleIsString
        });
      case 'expression':
        return new ExportStatement({
          type: 'expression',
          // members: properties.members.map((member)=>new ExportMember(member)),
          // module: properties.module,
          // moduleIsString: properties.moduleIsString
        });
    }

  }

}

class ExportMember {
  constructor({name, alias, type}){
    this.name = name;
    this.alias = alias;
    this.type = type;
  }
}

class ExportStatement {
  constructor({type, members, module, moduleIsString}){
    this.type = type;
    this.members = members;
    this.module = module;
    this.moduleIsString = moduleIsString;
  }
}