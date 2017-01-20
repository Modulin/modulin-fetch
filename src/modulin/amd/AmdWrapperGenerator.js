export default class WrapperGeneratorAmd {

  constructor({importGenerator, exportGenerator, getDefinePropertyName}){
    this.importGenerator = importGenerator;
    this.exportGenerator = exportGenerator;
    this.getDefinePropertyName = getDefinePropertyName;
  }

  wrap({script, imports, exports}) {
    const {dependencyList, dependencyArguments} = this.importGenerator.generate(imports);
    const {exportMappings} = this.exportGenerator.generate(exports);

    const origin = document.location.origin;
    const absoluteUrl = `${origin}/${script.url}`;

    const defineFunctionName = this.getDefinePropertyName();
    const scriptSource = script.source;
    const defineWrappedSource = `${defineFunctionName}("${script.id}", ${dependencyList}, function(${dependencyArguments}){ "use strict"; ${scriptSource}\n${exportMappings}\n});`;
    const sourceMappedSource = `${defineWrappedSource}\n//# sourceURL=${absoluteUrl}`;

    script.source = sourceMappedSource;
  }

}

