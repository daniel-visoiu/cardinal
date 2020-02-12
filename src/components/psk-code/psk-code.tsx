import {Component, Element, h, State, Prop} from "@stencil/core";
import Prism from 'prismjs';
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";
import CustomTheme from "../../decorators/CustomTheme";

const HTML_COMMENT_TAG = /<!---->/gm;

@Component({
  tag: "psk-code"
})
export class PskCode {
  @CustomTheme()

  @TableOfContentProperty({
    description: `This property is the title of the psk-chapter that will be created.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() title: string = "";

  @TableOfContentProperty({
    description: `This property is the language, in which the code is written(so the css can identify it).`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() language: string = 'xml';

  @State() componentCode: string = "";
  @Element() host: HTMLDivElement;

  private detachedInnerHTML = null;

  constructor() {
    this.detachedInnerHTML = Array.from(this.host.children)
      .map((child: Node) => child.parentNode.removeChild(child));
  }

  componentWillLoad() {

    switch (this.language.toLowerCase()) {
      case "javascript":
      case "css":
      case "json":
      case "shell-session":
        this.componentCode = this.host.innerText;
        this.host.innerHTML = this.host.innerHTML.replace(this.host.innerText, '');
        break;
      default:
        this.componentCode = this.detachedInnerHTML.map((child: Element) => child.outerHTML).join('');
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

    let codeLines = decodedCode.split("\n");

    // @ts-ignore
    let trimmedLine = codeLines[codeLines.length-1].trimLeft();

    let whitespacesNr = codeLines[codeLines.length-1].length-trimmedLine.length;

    let newLines = [trimmedLine];
    if(codeLines.length-2>0){
      for(let i = codeLines.length-2; i>=0; i--){
        let line = codeLines[i];
        let currentWhiteSpacesNr = whitespacesNr;
        // @ts-ignore
        let lineWithoutLeftWhiteSpaces = line.trimLeft();

        if(line.length-lineWithoutLeftWhiteSpaces.length<whitespacesNr){
          currentWhiteSpacesNr = line.length-lineWithoutLeftWhiteSpaces.length;
        }
        line  = line.substring(currentWhiteSpacesNr);
        newLines.push(line);
      }
    }

    let processedCode = newLines.reverse().join("\n");


    const sourceCode = (
      <pre>
        <code class={`language-${this.language}`}>
          {processedCode}
        </code>
      </pre>
    );

    if (this.title.replace(/\s/g, '') === '') {
      return <div>{sourceCode}</div>;
    }

    return <psk-chapter title={this.title}>{sourceCode}</psk-chapter>;
  }
}
