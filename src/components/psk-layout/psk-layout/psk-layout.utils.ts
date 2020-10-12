function applyStyles(host: HTMLElement, styles: string) {
  /** shadow manner **/
  const style = document.createElement('style');
  style.innerHTML = styles;
  host.shadowRoot.appendChild(style);

  /** inline styles **/
  // host.style.setProperty(property, properties[property]);

  /** stylesheet manner **/
  /*
  // StyleSheet, CSSStyleSheet, adoptedStyleSheets
  // 2019, under development

  console.log('before', this.__host.shadowRoot.styleSheets);

  // @ts-ignore
  this.__host.shadowRoot.styleSheets.item(0).insertRule(style);

  console.log('after', this.__host.shadowRoot.styleSheets);
  */
}

function generateRule(selector: string, properties: { [key: string]: string }) {
  let styles = `${selector} {\n`;
  for (const property in properties) {
    styles += `\t${property}: ${properties[property]};\n`;
  }
  styles += '}';
  return styles;
}

export { applyStyles, generateRule }
