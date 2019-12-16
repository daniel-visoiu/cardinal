import {Component, h, Prop, EventEmitter, Event, State, Element} from '@stencil/core';
import ControllerFactory from "../../services/ControllerFactory";
import {ExtendedHistoryType} from "../../interfaces/ExtendedHistoryType";
import {HTMLStencilElement} from "@stencil/core/internal";

@Component({
  tag: 'psk-app-root',
  shadow: true
})
export class PskAppRoot {
  @Prop() controller: any;
  @State() mobileLayout: boolean = false;
  @State() historyType: ExtendedHistoryType;
  @State() componentCode: string = "";
  @Element() host: HTMLStencilElement;
  @State() hasSlot: boolean = false;
  @State() htmlLoader:HTMLElement;

  @Event({
    eventName: 'routeChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) routeChangedEvent: EventEmitter;

  __createLoader() {

    const NR_CIRCLES = 12;
    let circles = "";

    for (let i = 1; i <= NR_CIRCLES; i++) {
      circles += `<div class="sk-circle${i} sk-circle"></div>`
    }

    let node = document.createElement("div");
    node.className="app-loader";
    node.innerHTML = `<div class='sk-fading-circle'>${circles}</div>`;
    return node;
  }

  constructor() {
    this.htmlLoader = this.__createLoader();
    document.getElementsByTagName("body")[0].appendChild(this.htmlLoader);

    if (this.controller) {
      let controllerName = this.controller;
      ControllerFactory.getController(controllerName).then((controller) => {
        new controller(this.host)
      })
    } else {
      console.log("No controller added to app-root");
    }
  }

  @Event({
    eventName: "controllerFactoryIsReady",
    composed: true,
    cancelable: true
  }) cfReadyEvent: EventEmitter;


  componentWillLoad() {
    this.cfReadyEvent.emit(ControllerFactory);
    let innerHTML = this.host.innerHTML;
    innerHTML = innerHTML.replace(/\s/g, "");
    if (innerHTML.length) {
      this.hasSlot = true;
    }
  }

  componentDidLoad(){
    document.getElementsByTagName("body")[0].removeChild(this.htmlLoader);
  }

  render() {
    let DefaultRendererTag = "psk-default-renderer";
    return (
      this.hasSlot ? <slot/> : <DefaultRendererTag></DefaultRendererTag>
    );
  }
}
