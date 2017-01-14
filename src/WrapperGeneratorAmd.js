class WrapperGeneratorAmd {

  constructor({importGenerator, exportGenerator}){
    this.importGenerator = importGenerator;
    this.exportGenerator = exportGenerator;
  }

  wrap(script, imports, exports) {
    const {dependencyList, dependencyArguments, dependencyMappings} = this.importGenerator.generate(imports);
    const {exportMappings} = this.exportGenerator.generate(exports);

    return `define(${dependencyList}, function(${dependencyArguments}){ ${dependencyMappings}\n${script}\n${exportMappings}\n});`;
  }
}