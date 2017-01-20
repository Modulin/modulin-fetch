export default class AmdExportGenerator {
  constructor(){ }

  generate(exportStatements) {
    const exportMappings = exportStatements
      .map(statement=>this.formatImportMembers(statement.members))
      .filter(line=>!!line)
      .join('');

    return {
      exportMappings
    }
  }

  generateId() {
    return `__EXPORT${++this.counter}`
  }

  formatImportMembers(members) {
    return members.map( member =>this.formatImportMember(member)).join(';');
  }

  formatImportMember(member){
    const name = member.name;
    const alias = member.alias || name;

    switch(member.type) {
      case "mapped":
        return `exports['${alias}'] = ${name};`;
      case "resolved":
        return '';
      default:
        throw "Unknown member type"
    }
  }

}