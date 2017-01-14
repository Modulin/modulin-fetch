import Modulin from './modulin/Modulin';
import ScriptLoader from './modulin/ScriptLoader';

import ImportParser from './modulin/ImportParser';
import ImportTokenizer from './modulin/ImportTokenizer';
import ExportParser from './modulin/ExportParser';
import ExportTokenizer from './modulin/ExportTokenizer';

import AmdFactory from './modulin/AmdFactory';
import ImportGeneratorAmd from './modulin/ImportGeneratorAmd';
import ExportGeneratorAmd from './modulin/ExportGeneratorAmd';
import WrapperGeneratorAmd from './modulin/WrapperGeneratorAmd';
import AmdDependencyResolver from './modulin/AmdDependencyResolver';
import AmdDependencyRepository from './modulin/AmdDependencyRepository';

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
      intercept,
      basePath
    }),
    dependencyResolver: new AmdDependencyResolver()
  })
});