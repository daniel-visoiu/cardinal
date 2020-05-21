import { Component, Element, h, State, Prop } from "@stencil/core";
import Prism from 'prismjs';
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-shell-session.js";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import CustomTheme from "../../decorators/CustomTheme";
import { BindModel } from "../../decorators/BindModel";

const HTML_COMMENT_TAG = /<!---->/gm;

@Component({
  tag: "psk-code"
})
export class PskCode {
  @CustomTheme()
  @BindModel() modelHandler;

  @TableOfContentProperty({
    description: `This property is the title of the psk-chapter that will be created.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() title: string = "";

  @TableOfContentProperty({
    description: `This property is setting the language of the code snippet. Supported values are: xml (default if not provided), markup, javascript, css, json, shell-session, bash.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() language: string = 'xml';

  @State() componentCode: string = "";
  @Element() host: HTMLDivElement;


  componentWillLoad() {
    this.componentCode = this.host.innerHTML;
    let styleElement = this.host.querySelector("style");
    if (styleElement) {
      this.host.innerHTML = styleElement.outerHTML;
      this.componentCode = this.componentCode.replace(styleElement.outerHTML, "");
    } else {
      this.host.innerHTML = "";
    }
  }

  componentDidLoad() {
    Prism.highlightAllUnder(this.host);
  }

  render() {
    let componentCode = document.createElement('textarea');
    componentCode.innerHTML = this.componentCode;
    let decodedCode = componentCode.value;
    decodedCode = decodedCode.replace(HTML_COMMENT_TAG, "");
    decodedCode = decodedCode.trim();
    let codeLines = decodedCode.split("\n");

    let newLines = [];
    if (codeLines.length) {
      /*
        removing left whitespaces and calculating left offset
        since the trim() called before removed all left whitespaces for the first line, we use the last line
        to calculate offset.
      */
      // @ts-ignore --Typescript does not recognize trimLeft!?
      let trimmedLine = codeLines[codeLines.length - 1].trimLeft();
      let offset = codeLines[codeLines.length - 1].length - trimmedLine.length;
      for (let i = 0; i < codeLines.length; i++) {
        let line = codeLines[i];
        let currentOffset = offset;
        // @ts-ignore --Typescript does not recognize trimLeft!?
        let lineOffset = line.trimLeft();

        //if code is not well-formatted we use the smallest offset.
        if (line.length - lineOffset.length < offset) {
          currentOffset = line.length - lineOffset.length;
        }
        line = line.substring(currentOffset);
        newLines.push(line);
      }
    }

    let processedCode = newLines.join("\n");

    const sourceCode = (
      <pre>
        <code class={`language-${this.language}`}>
          {processedCode}
        </code>
      </pre>
    );

    if (this.title.replace(/\s/g, '') === '') {
      return sourceCode;
    }

    return <psk-chapter title={this.title}>{sourceCode}</psk-chapter>;
  }
}
