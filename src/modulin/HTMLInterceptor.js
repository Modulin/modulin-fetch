export default class HTMLInterceptor {
  intercept(script) {
    const html = script.source
      .replace(/"/g, `\\"`)
      .replace(/\n/g, '<!-- LINE BREAK --!>');

    script.source = `var template = "${html}";\nexport {template as default}`;

    return script;
  }
}