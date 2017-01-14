import {ImportStatement} from "./ImportParser"

export default class Modulin {

  constructor({importParser, exportParser, wrapperGenerator, dependencyRepositoryFactory, loaderFactory}){
    this.importParser = importParser;
    this.exportParser = exportParser;
    this.wrapperGenerator = wrapperGenerator;
    this.dependencyRepositoryFactory = dependencyRepositoryFactory;
    this.loaderFactory = loaderFactory;

    this.defautImports = [
      new ImportStatement({moduleName: 'exports', id: 'exports', members: [] })
    ];
    this.defaultExports = [];
  }

  getScriptInterceptor(){
    return this.intercept.bind(this);
  }

  intercept(script, id) {
    const importsExports = {imports : [...this.defautImports], exports: [...this.defaultExports]};

    const scriptImportsFormatted = this.importParser.parse(script, importsExports, id);
    const scriptExportsFormatted = this.exportParser.parse(scriptImportsFormatted, importsExports, id);

    return this.wrapperGenerator.wrap(scriptExportsFormatted, importsExports.imports, importsExports.exports);
  }

  createLoader(basePath) {

    const dependencyRepository = this.dependencyRepositoryFactory({
      intercept: this.getScriptInterceptor(),
      basePath: basePath
    });

    return this.loaderFactory.createLoader(dependencyRepository);
  }
}