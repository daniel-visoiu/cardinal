import {Component, h, Prop, EventEmitter, Event, State, Element} from '@stencil/core';
import ControllerFactory from "../../services/ControllerFactory";
import {ExtendedHistoryType} from "../../interfaces/ExtendedHistoryType";

@Component({
  tag: 'psk-app-root',
  shadow: true
})
export class PskAppRoot {
  @Prop() controller: any;
  @State() mobileLayout: boolean = false;
  @Prop() historyType: ExtendedHistoryType;
  @State() componentCode: string = "";
  @Element() host: HTMLDivElement;
  @State() hasSlot: boolean = false;

  @Event({
    eventName: 'routeChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) routeChangedEvent: EventEmitter;

  constructor() {
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

  render() {
    let DefaultRendererTag = "psk-default-renderer";
    let defaultRenderer = <DefaultRendererTag historyType={this.historyType}></DefaultRendererTag>;
    return (
      this.hasSlot ? <slot/> : defaultRenderer
    );
  }
}
