import '../polyfills/polyfills';

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

const importGenerator = new ImportGeneratorAmd();
const exportGenerator = new ExportGeneratorAmd();





export default new Modulin({
  importParser: new ImportParser(new ImportTokenizer(importGenerator)),
  exportParser: new ExportParser(new ExportTokenizer(exportGenerator)),
  loaderFactory: new AmdFactory(),
  wrapperGenerator: new WrapperGeneratorAmd({ importGenerator, exportGenerator}),
  dependencyRepositoryFactory: ({intercept, basePath})=> new AmdDependencyRepository({
    scriptLoader: new ScriptLoader({
      fetch: (url)=>new Request({url}),
      intercept,
      basePath
    }),
    dependencyResolver: new AmdDependencyResolver()
  })
});