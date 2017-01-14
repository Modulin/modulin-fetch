const modulin = new Modulin({
  importParser: new ImportParser(),
  exportParser: new ExportParser(),
  loaderFactory: new AmdFactory(),
  wrapperGenerator: new WrapperGeneratorAmd({
    importGenerator: new ImportGeneratorAmd(),
    exportGenerator: new ExportGeneratorAmd()
  }),
  dependencyRepository: new AmdDependencyRepository({
    scriptLoader: new ScriptLoader({
      basePath: 'examples'
    }),
    dependencyResolver: new AmdDependencyResolver()
  })
});