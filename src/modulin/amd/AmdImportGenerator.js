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
    return members.map((member)=>this.formatImportMember(id, member)).join(';');
  }

  formatImportMember(id, member){
    const name = member.name;
    const alias = member.alias || name;

    switch(member.type) {
      case "default":
        return `var ${alias} = ${id}.exports["default"]`;
      case "all":
        return `var ${alias} = ${id}.exports`;
      case "mapped":
        return `var ${alias} = ${id}.exports["${name}"]`;
      default:
        return '';
    }
  }
}