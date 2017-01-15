export default class WrapperGeneratorAmd {

  constructor({importGenerator, exportGenerator}){
    this.importGenerator = importGenerator;
    this.exportGenerator = exportGenerator;
  }

  wrap({script, imports, exports}) {
    const {dependencyList, dependencyArguments, dependencyMappings} = this.importGenerator.generate(imports);
    const {exportMappings} = this.exportGenerator.generate(exports);

    const origin = document.location.origin;
    const absoluteUrl = `${origin}/${script.url}`;

    const scriptSource = script.source;
    const defineWrappedSource = `define("${script.id}", ${dependencyList}, function(${dependencyArguments}){ ${dependencyMappings}\n${scriptSource}\n${exportMappings}\n});`;
    const sourceMappedSource = `${defineWrappedSource}\n//# sourceURL=${absoluteUrl}`;

    script.source = sourceMappedSource;
  }
}