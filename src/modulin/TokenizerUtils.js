class TokenizerUtils {
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

  static splitVariableAndValue(string){
    const splitRe = /=/;
    const type = 'mapped';
    const [name, value] = string
      .split(splitRe)
      .map(trim);

    return {name, value, type};

    function trim(str){
      return str.trim();
    }
  }

  static filterEmpty(str){
    return !!str.trim();
  }
}