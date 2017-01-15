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
    const defineWrappedSource = `define(${dependencyList}, function(${dependencyArguments}){ ${dependencyMappings}\n${scriptSource}\n${exportMappings}\n});`;
    const namedSource = `define.amd.__scriptSource = "${script.id}"; ${defineWrappedSource};`;
    const sourceMappedSource = `${namedSource}\n//# sourceURL=${absoluteUrl}`;

    script.source = sourceMappedSource;
  }
}