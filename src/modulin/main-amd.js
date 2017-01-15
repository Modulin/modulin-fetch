import Modulin from './Modulin';
import Request from "./Request";
import ScriptLoader from './ScriptLoader';

import ImportParser from './ImportParser';
import ImportTokenizer from './ImportTokenizer';
import ExportParser from './ExportParser';
import ExportTokenizer from './ExportTokenizer';

import AmdFactory from './amd/AmdFactory';
import ImportGeneratorAmd from './amd/AmdImportGenerator';
import ExportGeneratorAmd from './amd/AmdExportGenerator';
import WrapperGeneratorAmd from './amd/AmdWrapperGenerator';
import AmdDependencyResolver from './amd/AmdDependencyResolver';
import AmdDependencyRepository from './amd/AmdDependencyRepository';

export default new Modulin({
  importParser: new ImportParser(new ImportTokenizer()),
  exportParser: new ExportParser(new ExportTokenizer()),
  loaderFactory: new AmdFactory(),
  wrapperGenerator: new WrapperGeneratorAmd({
    importGenerator: new ImportGeneratorAmd(),
    exportGenerator: new ExportGeneratorAmd()
  }),
  dependencyRepositoryFactory: ({intercept, basePath})=> new AmdDependencyRepository({
    scriptLoader: new ScriptLoader({
      fetch: (url)=>new Request({url}),
      intercept,
      basePath
    }),
    dependencyResolver: new AmdDependencyResolver()
  })
});