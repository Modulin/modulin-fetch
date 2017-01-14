var modulin = new Modulin({
  importParser: new ImportParser(),
  exportParser: new ExportParser(),
  loaderFactory: new AmdFactory(),
  wrapperGenerator: new WrapperGeneratorAmd({
    importGenerator: new ImportGeneratorAmd(),
    exportGenerator: new ExportGeneratorAmd()
  }),
  dependencyRepositoryFactory: ({intercept, basePath})=> new AmdDependencyRepository({
    scriptLoader: new ScriptLoader({
      intercept,
      basePath
    }),
    dependencyResolver: new AmdDependencyResolver()
  })
});