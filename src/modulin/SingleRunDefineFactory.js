export default class SingleRunDefineFactor {
  constructor(define){
    this.define = define;
    this.uidCounter = 0;
    this.prefix = `${Math.random()}_`.replace(/\./g, '');
  }

  registerGlobal() {
    const key = this.getNamespace();
    if(!window[key] )
      window[key] = {};
  }

  setInstance(define){
    this.define = define;
  }

  getNamespace(){
    return `__singleRunDefine`;
  }

  getUID() {
    return `${this.prefix}${++this.uidCounter}`;
  }

  create() {

    const define = this.define;

    if(!define)
      throw new Error(`A define method has not been registered on the define factory`);

    const namespace = this.getNamespace();
    const uid = this.getUID();
    window[namespace][uid] = singleUseDefine;

    const name = `window["${namespace}"]["${uid}"]`;
    return name;

    function singleUseDefine() {
      delete window[namespace][uid];
      define.apply(define, arguments);

    }
  }
}