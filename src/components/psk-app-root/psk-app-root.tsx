import {Component, h, Prop, EventEmitter, Event, Listen, State, Element} from '@stencil/core';
import {HistoryType} from "@stencil/router/dist/types/global/interfaces";
import ControllerFactory from "../../services/ControllerFactory";

const appMaxWidth = 650;

@Component({
  tag: 'psk-app-root',
  styleUrl: 'psk-app-root.css',
  shadow: true,
})
export class PskAppRoot {

  @Prop() controller: any;
  @State() mobileLayout: boolean = false;
  @Prop() historyType: HistoryType;
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
    eventName: "ControllerFactoryIsReady",
    composed: true,
    cancelable: true
  }) cFReadyEvent: EventEmitter;


  @Listen("resize", {capture: true, target: 'window'})
  checkLayout() {
    this.mobileLayout = document.documentElement.clientWidth < appMaxWidth;
  }

  componentWillLoad() {
    this.cFReadyEvent.emit(ControllerFactory);
    this.checkLayout();
    let innerHTML = this.host.innerHTML;
    innerHTML = innerHTML.replace(/\s/g, "");
    if (innerHTML.length) {
      this.hasSlot = true;
    }

  }

  render() {

    let defaultSlot = [<aside>
      <psk-user-profile></psk-user-profile>
      <app-menu item-renderer="sidebar-renderer" hamburgerMaxWidth={appMaxWidth}></app-menu>
      {this.mobileLayout === false ? <div class="nav-footer">version 0.1</div> : null}
    </aside>,

      <section>
        <psk-app-router failRedirectTo="/home" historyType={this.historyType}></psk-app-router>
        {this.mobileLayout === true ? <div class="nav-footer bottom-stick">version 0.1</div> : null}
      </section>];


    return (
      <div class={`global_container ${this.mobileLayout ? "is-mobile" : ""}`}>
        {this.hasSlot ? <slot/> : defaultSlot}
      </div>
    );
  }
}
