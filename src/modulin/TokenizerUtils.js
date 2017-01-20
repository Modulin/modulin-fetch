export default class TokenizerUtils {
  static splitMemberAndAlias(string){
    const splitRe = /\s+as\s+/g;
    const type = 'mapped';
    const [name, alias] = string
      .split(splitRe)
      .map(trim);

    return {name, alias, type};

    function trim(str){
      return str.trim();
    }
  }

  static resolveRelativePath(cwd, path) {
    const excessiveDotsRe = /(^|\/)([\\.]){3,}/g;
    const noOpsRe = /(^|\/)[.](?=[^.])/g;
    const resolveRe = /(\.?[^.\n/]+)+(^|\/)[.]{2}/;

    const startChar = path[0];
    if(startChar === '/' || startChar === '.') {
      let fullPath = startChar === '/'
        ? path
        : cwd + path;

      fullPath = fullPath.replace(excessiveDotsRe, '');
      fullPath = fullPath.replace(noOpsRe, '');

      let resolvedFullPath = fullPath.replace(resolveRe, '');
      while(fullPath !== resolvedFullPath) {
        fullPath = resolvedFullPath;
        resolvedFullPath = fullPath.replace(resolveRe, '');
      }
      return fullPath;
    } else {
      return path;
    }
  }

  static splitVariableAndValue(string){
    const splitRe = /=/;
    const type = 'mapped';
    const [name, value] = string
      .split(splitRe)
      .map(trim);

    return {name, value, type};

    function trim(str){
      return str.trim().replace(/;$/, '');
    }
  }

  static filterEmpty(str){
    return !!str.trim();
  }
}