export default class ExportParser {

  constructor(tokenizer){
    this.tokenizer = tokenizer;
  }

  rewrite({script, exports}){
    const lines = this.tokenizer.extractExports(script);
    exports.push(...this.tokenizeLines(lines));
  }

  tokenizeLines(lines){
    return lines.map((line)=>this.tokenize(line));
  }

  tokenize(lineExpression){
    const {type, line} = lineExpression;
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
      case 'defaultExpression':
        return new ExportStatement({
          type: 'mapped',
          members: [new ExportMember({
            name: lineExpression.name,
            alias: 'default',
            type: 'mapped'
          })]
        });
      case 'expression':
        return new ExportStatement({
          type: 'mapped',
          members: [new ExportMember({
            name: lineExpression.name,
            type: 'mapped'
          })]
        });
      default:
        throw "Unknown line expression type";
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