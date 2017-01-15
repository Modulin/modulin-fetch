export default class ExportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  rewrite({script, exports}){
    const lines = this.extractLines(script);
    exports.push(...this.tokenizeLines(lines));
  }

  extractLines(script){
    const scriptSource = script.source;
    const lines = [];

    const variableDeclarationRe = /^\s*export\s+((?:let|var|const)\s+[^\n]+)/gm;
    const variableDeclarationSource = scriptSource.replace(variableDeclarationRe, (line, variable) =>{
      const type = 'variableDeclaration';
      lines.push({type, line});
      return variable;
    });

    const predeclaredVariableRe = /^\s*export\s+(?:{[\w\s,-]*}|\*)[^\n]*\n?/gm;
    const preDeclaredVariableSource = variableDeclarationSource.replace(predeclaredVariableRe, line =>{
      const type = 'preDeclaredVariable';
      lines.push({type, line});
      return '';
    });

    const expressionRe = /^\s*export\s+(default\s+)?(([\w{(]+)(?:\s+([\w]+))?)/gm;
    const exporessionSource = preDeclaredVariableSource.replace(expressionRe, (line, isDefault, fullExpression, expression, name) =>{
      if(isDefault) {
        return `exports['default'] = ${fullExpression}`;
      } else {
        return `exports['${name}'] = ${fullExpression}`;
      }
    });

    const allRe = /^\s*export\s+\w[^\n]*/gm;
    const validatedSource = exporessionSource.replace(allRe, (line)=>{ throw `Invalid export: ${line}`; });

    script.source = validatedSource;
    return lines;
  }

  tokenizeLines(lines){
    return lines.map((line)=>this.tokenize(line));
  }

  tokenize({type, line}){
    let properties;
    switch(type){
      case 'variableDeclaration':
        properties = this.tokenizer.variableDeclaration(line);

        return new ExportStatement({
          type: 'variable',
          members: properties.members.map((member)=>new ExportMember(member))
        });
      case 'preDeclaredVariable':
        properties = this.tokenizer.preDeclaredVariables(line);

        return new ExportStatement({
          type: 'mapped',
          members: properties.members.map((member)=>new ExportMember(member)),
          module: properties.module,
          moduleIsString: properties.moduleIsString
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