export default class AmdWrapperGenerator {
  constructor(){
    this.counter = 0;
  }

  generateId() {
    return `__DEP${++this.counter}`
  }

  generate(importStatements) {
    return {
      dependencyList: this.generateDependencyList(importStatements),
      dependencyArguments: this.generateDependencyArguments(importStatements)
    }
  }

  generateDependencyArguments(importStatements){
    const dependencyNames = importStatements
      .map(statement=>statement.id)
      .join(',');

    return dependencyNames;
  }

  generateDependencyList(importStatements){
    const dependencies = importStatements
      .map(statement=>statement.moduleName)
      .map(moduleName=>`"${moduleName}"`)
      .join(',');

    return `[${dependencies}]`;
  }

  formatImportMembers({id, members}) {
    return members.map((member)=>this.formatImportMember(id, member)).join('');
  }

  formatImportMember(id, member){
    const alias = member.alias || member.name;

    switch(member.type) {
      case "default":
      case "all":
      case "mapped":
        return `var ${alias} = ${this.formatImportValue(id, member)};`;
      case "passThroughAll":
        return `Object.assign(exports, ${this.formatImportValue(id, {type: 'all'})});`;
      case "passThrough":
        return `exports["${alias}"] = ${this.formatImportValue(id, {type: 'mapped', name: member.name})};`;
      default:
        return '';
    }
  }

  formatImportValue(id, {name, type}) {
    switch(type) {
      case "default":
        return `${id}.exports["default"]`;
      case "all":
        return `${id}.exports`;
      case "mapped":
        return `${id}.exports["${name}"]`;
      default:
        return '';
    }
  }
}