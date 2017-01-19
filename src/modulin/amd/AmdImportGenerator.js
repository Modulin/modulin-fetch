export default class AmdWrapperGenerator {
  constructor(){
    this.counter = 0;
  }

  generateDependencyMapping({id, statement}) {
    return this.formatImportMembers(id, statement.members);
  }

  generate(importStatements) {
    const processedImportStatements = importStatements.map(statement => {
      const id = statement.id;
      return {id, statement}
    });

    const dependencies = processedImportStatements
      .map(s=>s.statement.moduleName)
      .map(moduleName=>`"${moduleName}"`)
      .join(',');

    const dependencyNames = processedImportStatements
      .map(s=>s.id)
      .join(',');

    return {
      dependencyList: `[${dependencies}]`,
      dependencyArguments: dependencyNames
    }
  }

  generateId() {
    return `__DEP${++this.counter}`
  }

  formatImportMembers(id, members) {
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