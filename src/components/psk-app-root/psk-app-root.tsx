import { Component, h, Prop, State, Element } from '@stencil/core';
import ControllerRegistryService from "../../services/ControllerRegistryService";
import { ExtendedHistoryType } from "../../interfaces/ExtendedHistoryType";
import { HTMLStencilElement } from "@stencil/core/internal";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-app-root',
  shadow: true
})
export class PskAppRoot {
  @TableOfContentProperty({
    isMandatory: true,
    description: [`This property is a string that will permit the developer to choose his own controller.`,
      `It is recommended that each app to extend the provided default controller and adapt it to the application needs`],
    propertyType: `string`,
    defaultValue: `null`
  })
  @Prop() controller: any;
  @State() mobileLayout: boolean = false;
  @State() historyType: ExtendedHistoryType;
  @State() componentCode: string = "";
  @Element() host: HTMLStencilElement;
  @State() hasSlot: boolean = false;
  @State() htmlLoader: HTMLElement;
  @State() disconnected: boolean | false;

  __createLoader() {

    const NR_CIRCLES = 12;
    let circles = "";

    for (let i = 1; i <= NR_CIRCLES; i++) {
      circles += `<div class="sk-circle${i} sk-circle"></div>`
    }

    let node = document.createElement("div");
    node.className = "app-loader";
    node.innerHTML = `<div class='sk-fading-circle'>${circles}</div>`;
    return node;
  }

  connectedCallback() {
    this.disconnected = false;
  }

  disconnectedCallback() {
     this.disconnected = true;
  }

  componentWillLoad() {
    if (this.host.parentElement) {
      this.htmlLoader = this.__createLoader();
      this.host.parentElement.appendChild(this.htmlLoader);
    }

    let innerHTML = this.host.innerHTML;
    innerHTML = innerHTML.replace(/\s/g, "");
    if (innerHTML.length) {
      this.hasSlot = true;
    }

    if (typeof this.controller === "string") {
      return new Promise((resolve, reject) => {
        ControllerRegistryService.getController(this.controller).then((CTRL) => {
          // Prevent javascript execution if the node has been removed from DOM
          if (this.disconnected) {
            return resolve();
          }
          new CTRL(this.host);
          resolve();
        }).catch(reject);
      })
    }
    else {
      console.error("No controller added to app-root");
    }
  }

  componentDidLoad() {
    if (this.htmlLoader && this.htmlLoader.parentNode) {
      this.htmlLoader.parentNode.removeChild(this.htmlLoader);
    }
  }

  render() {
    let DefaultRendererTag = "psk-default-renderer";
    return (
      this.hasSlot
        ? <slot />
        : <DefaultRendererTag />
    );
  }
}
