export default class ExportStatement {
  constructor({members, module, expression}){
    this.members = members;
    this.module = module;
    this.expression = expression;
  }
}