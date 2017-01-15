export default class AmdExportGenerator {
  constructor(){ }

  generate(exportStatements) {
    const exportMappings = exportStatements
      .map(statement=>this.formatImportMembers(statement.members))
      .join(';\n  ');

    return {
      exportMappings
    }
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
      default:
        return '';
    }
  }

}