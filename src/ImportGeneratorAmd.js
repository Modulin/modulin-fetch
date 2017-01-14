class ImportGeneratorAmd {
  constructor(){
    this.counter = 0;
  }

  generate(script, importStatements) {
    const res = this.wrap(script, importStatements);
    return res;
  }

  generateId() {
    return `__DEP${++this.counter}`
  }

  wrap(script, importStatements) {
    const processedImportStatements = importStatements.map(statement => ({id: this.generateId(), statement}));

    const dependencies = processedImportStatements
      .map(s=>s.statement.moduleName)
      .map(moduleName=>`"${moduleName}"`)
      .join(',');

    const dependencyNames = processedImportStatements
      .map(s=>s.id)
      .join(',');

    const mappedDependencies = processedImportStatements
      .map(s=>s.statement.members
        .map(member=>{
          const id = s.id;
          const name = member.name;
          const alias = member.alias || name;

          switch(member.type) {
            case "default":
              return `var ${alias} = ${id}["default"]`;
            case "all":
              return `var ${alias} = ${id}`;
            case "mapped":
              return `var ${alias} = ${id}["${name}"]`;
            default:
              return '';
          }
        })
        .join(';')
      )
      .join(';\n  ');

    return `define([${dependencies}], function(${dependencyNames}){ ${mappedDependencies}\n${script}});`
  }
}