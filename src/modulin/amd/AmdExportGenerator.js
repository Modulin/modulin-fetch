export default class AmdExportGenerator {
  constructor(){ }

  generate(exportStatements) {
    return {
      exportMappings: this.generateExportMappings(exportStatements)
    }
  }

  generateExportMappings(exportStatements) {
    const exportMappings = exportStatements
      .map(statement=>this.formatExportMembers(statement.members))
      .filter(line=>!!line)
      .join('');

    return exportMappings;
  }

  formatExportMembers(members) {
    return members.map( member =>this.formatExportMember(member)).join(';');
  }

  formatExportMember(member){
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