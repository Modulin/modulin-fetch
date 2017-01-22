import modulizeCss from './css/modulizeCss';

export default class CssInterceptor {
  intercept(script) {
    const namespace = script.id
      .replace(/[/]/g, 'O')
      .replace(/\.[^/.]*$/, '');
    const substitutionPattern = '{namespace}__{name}';
    const source = script.source;

    const localized = modulizeCss(source, {namespace, substitutionPattern});
    const selectors = this.keyValueArrayToObject(localized.substitutions);

    this.generateJs(selectors, script);
    this.addCSSToDOM(localized.encodedCss, script);

    return script;
  }

  addCSSToDOM(css, script) {
    const element = document.createElement('style');
    element.setAttribute('data-src', script.id);
    element.innerHTML = css;
    document.head.appendChild(element);
  }

  keyValueArrayToObject(map) {
    return Object
      .keys(map)
      .filter(it=>it)
      .reduce((subs, key)=> {
        const selector = map[key].join(' ');
        subs[key] = `${selector}`;
        return subs;
      }, {})
  }
  generateJs(selectors, script) {
    const encodedSelectors = JSON.stringify(selectors);
    script.source = `var selectors = JSON.parse('${encodedSelectors}');\nexport {selectors as default}`;
  }
}