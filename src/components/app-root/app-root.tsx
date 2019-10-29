import {Component, h, Prop, EventEmitter, Event, Listen, State} from '@stencil/core';
import {RouterHistory} from "@stencil/router";
const appMaxWidth = 650;

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {

  @Prop() controller: any;
  @Prop() history: RouterHistory;
  @State() mobileLayout: boolean = false;

  @Event({
    eventName: 'routeChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) routeChangedEvent:EventEmitter;

  constructor(){
    if(!this.controller){
      console.log("No controller here")
    }
    else{
      //lets initiate external controller
    }
  }

  @Listen("resize", {capture: true, target: 'window'})
  checkLayout() {
    this.mobileLayout = document.documentElement.clientWidth < appMaxWidth;
  }

  componentWillLoad(){
    this.checkLayout();
  }

  render() {
    return (
      <div class={`global_container ${this.mobileLayout ? "is-mobile" : ""}`}>
        <aside>
          <psk-user-profile/>
          <app-menu item-renderer="sidebar-renderer" hamburgerMaxWidth = {appMaxWidth}> </app-menu>
          {this.mobileLayout === false ? <div class="nav-footer">version 0.1</div> : null}
        </aside>

        <section>
          <psk-app-router failRedirectTo="/home" historyType="hash"> </psk-app-router>
          {this.mobileLayout === true ?<div class="nav-footer bottom-stick">version 0.1</div>:null}
        </section>
      </div>
    );
  }
}
