class Modulin {

  constructor({importParser, exportParser, wrapperGenerator, dependencyRepository, loaderFactory}){
    this.importParser = importParser;
    this.exportParser = exportParser;
    this.wrapperGenerator = wrapperGenerator;
    this.dependencyRepository = dependencyRepository;
    this.loaderFactory = loaderFactory;

    this.dependencyRepository.scriptLoader.intercept = this.getScriptInterceptor();

    this.defautImports = [
      new ImportStatement({moduleName: 'exports', id: 'exports', members: [] })
    ];
    this.defaultExports = [];
  }

  getScriptInterceptor(){
    return this.intercept.bind(this);
  }

  intercept(script){
    const importsExports = {imports : [...this.defautImports], exports: [...this.defaultExports]};

    const scriptImportsFormatted = this.importParser.parse(script, importsExports);
    const scriptExportsFormatted = this.exportParser.parse(scriptImportsFormatted, importsExports);

    return this.wrapperGenerator.wrap(scriptExportsFormatted, importsExports.imports, importsExports.exports);
  }

  createLoader() {
    return this.loaderFactory.createLoader(this.dependencyRepository);
  }
}