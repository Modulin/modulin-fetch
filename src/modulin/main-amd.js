import '../polyfills/polyfills';

import ModulinFactory from './ModulinFactory';
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
import SingleRunDefineFactor from "./SingleRunDefineFactory";

import JavascriptInterceptor from "./JavascriptInterceptor";
import CssInterceptor from "./CssInterceptor";

const importGenerator = new ImportGeneratorAmd();
const exportGenerator = new ExportGeneratorAmd();

const temporaryLoaderFactory = new SingleRunDefineFactor();
temporaryLoaderFactory.registerGlobal();

const scriptInterceptors = {
  default: new JavascriptInterceptor({
    importParser: new ImportParser(new ImportTokenizer(importGenerator)),
    exportParser: new ExportParser(new ExportTokenizer(exportGenerator, importGenerator)),
    wrapperGenerator: new WrapperGeneratorAmd({
      importGenerator, exportGenerator,
      getDefinePropertyName: () => temporaryLoaderFactory.create()
    }),
  }),
  css: new CssInterceptor()
};

function dependencyRepositoryFactory({basePath}){
  const scriptLoader = new ScriptLoader({
    fetch: (url)=>new Request({url}),
    scriptInterceptors,
    basePath
  });
  return new AmdDependencyRepository({
    loadScript: (path) => scriptLoader.load(path),
    dependencyResolver: new AmdDependencyResolver()
  });
}

export default new ModulinFactory({
  temporaryLoaderFactory,
  loaderFactory: new AmdFactory(),
  dependencyRepositoryFactory
});