export default function Button() {
  function constructor(template, style) {
    this.element = createElement(template, style);
  }

  function attach(target) {
    target.appendChild(this.element);
  }

  this.attach = attach;
  constructor.apply(this, arguments);
}

function createElement(template, style){
  var div = document.createElement('div');
  div.innerHTML = renderTemplate(template.trim(), style);
  return div.childNodes[0];
}

function renderTemplate(template, style) {
  return template.replace(/#([\w\-_]+)/g, function(_, key) {
    var cls = style[key];
    if(!cls){
      throw "Style not found";
    }
    return cls;
  });
}