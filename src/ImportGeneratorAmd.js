class ImportGeneratorAmd {
  constructor(){
    this.counter = 0;
  }

  generate(script, importStatements) {
    const res = this.wrap(script, importStatements);
    console.log(importStatements, res);
    return res;
  }

  generateId() {
    return `__AMDDEPENDENCY${++this.counter}`
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

          switch(member.type){
            case "default":
              return `const ${alias} = ${id}["default"]`;
            case "all":
              return `const ${alias} = ${id}`;
            case "mapped":
              return `const ${alias} = ${id}[${name}]`;
          }
        })
        .join(';')
      )
      .join(';\n');

    return `define([${dependencies}], function(${dependencyNames}){
      ${mappedDependencies}
      ${script}
    });`
  }
}