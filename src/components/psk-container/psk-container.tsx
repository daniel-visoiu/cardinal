import { Component, h, Prop, Element, State } from "@stencil/core";
import ControllerFactory from "../../services/ControllerFactory";

@Component({
  tag: "psk-container",
  shadow: true
})
export class PskContainer {
  @Prop() controllerName?: any | null;
  @Prop() htmlFilePath?: string | null;

  @State() controller: any | null;
  @State() innerHtml: string | null;
  @State() controllerScript: string | null;

  @Element() host: HTMLElement;

  constructor() {
    if (this.controllerName) {
      ControllerFactory.getController(this.controllerName).then(instance => {
        this.controller = new instance(this.host);
      });
    }

    const scriptInnerHtml: HTMLElement = this.host.querySelector(
      "psk-controller"
    );
    if (scriptInnerHtml !== null) {
      this.controllerScript = scriptInnerHtml.innerHTML;
      scriptInnerHtml.innerHTML = "";
    }

    const pskHtml: HTMLElement = this.host.querySelector("psk-html");
    if (pskHtml) {
      this.innerHtml = pskHtml.innerHTML;
    }
  }

  render() {
    return [
      this.htmlFilePath && <psk-page-loader pageUrl={this.htmlFilePath} />,
      this.innerHtml ? this._htmlToElement("div", this.innerHtml) : <slot />,
      this.controllerScript && this.controller.executeScript(this.controller, this.controllerScript)
    ];
  }

  _htmlToElement(tag: string, html: string): HTMLElement {
    const HTMLTag = tag;
    return <HTMLTag innerHTML={html}></HTMLTag>;
  }
}
