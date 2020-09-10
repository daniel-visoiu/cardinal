import {Component, h, Prop, State, Element, Listen, Host} from '@stencil/core';
import ControllerRegistryService from "../../services/ControllerRegistryService";
import { ExtendedHistoryType } from "../../interfaces/ExtendedHistoryType";
import { HTMLStencilElement } from "@stencil/core/internal";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import DefaultApplicationController from "../../controllers/DefaultApplicationController.js"
import {MOBILE_MAX_WIDTH} from "../../utils/constants";

const appMaxWidth = MOBILE_MAX_WIDTH;

@Component({
  tag: 'psk-app-root',
  shadow: true
})
export class PskAppRoot {
  @TableOfContentProperty({
    isMandatory: false,
    description: [`This property is a string that will permit the developer to choose his own controller.`,
      `If no controller is provided, a default controller will be passed to the component`,
      `It is recommended that each app to extend the provided default controller and adapt it to the application needs`],
    propertyType: `string`,
    defaultValue: `null`
  })
  @Prop() controller: any;
  @Prop() disableSidebar: boolean = false;
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

  @Listen("resize", { capture: true, target: 'window' })
  checkLayout() {
    this.mobileLayout = document.documentElement.clientWidth < appMaxWidth;
  }

  connectedCallback() {
    this.disconnected = false;
  }

  disconnectedCallback() {
     this.disconnected = true;
  }

  componentWillLoad() {
    this.checkLayout();
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
      //load default controller
      new DefaultApplicationController(this.host);
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
      <Host class={this.mobileLayout?"is-mobile":""} >
        {this.hasSlot
      ? <slot />
      : <DefaultRendererTag mobileLayout={this.mobileLayout} disableSidebar={this.disableSidebar} />}
      </Host>
    );
  }
}
