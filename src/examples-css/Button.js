export default class Button {
  constructor(template, style) {
    this.element = createElement(template, style);
  }

  attach(target) {
    target.appendChild(this.element);
  }
}

function createElement(template, style){
  var div = document.createElement('div');
  div.innerHTML = renderTemplate(template.trim(), style);
  return div.childNodes[0];
}

function renderTemplate(template, style) {
  return template.replace(/#([\w\-_]+)/g, (_, key)=>{
    const cls = style[key];
    if(!cls){
      throw "Style not found";
    }
    return cls;
  });
}