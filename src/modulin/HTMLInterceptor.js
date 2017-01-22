export default class HTMLInterceptor {
  intercept(script) {
    const html = script.source
      .replace(/"/g, `\\"`)
      .replace(/\n/g, '<!-- LINE BREAK --!>');

    script.source = `const template = "${html}";\nexport {template as default}`;

    return script;
  }
}