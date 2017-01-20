export default class ImportStatement {
  constructor({id, moduleName, members}){
    this.moduleName = moduleName;
    this.members = members;
    this.id = id;
  }
}