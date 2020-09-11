import { Component, Prop, State, Element, Event, EventEmitter, h } from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";
import ControllerRegistryService from "../../services/ControllerRegistryService";
import DefaultContainerController from "../../controllers/base-controllers/ContainerController";
import { RouterHistory } from "@stencil/router";

@Component({
  tag: 'psk-mobile',
  shadow: true
})

export class PskMobile {
  // TODO : Deny : wid : removed useless Promisify
  // promisifyControllerLoad(controllerName)

  // TODO : Deny : remark : controller stuff
  // controller-name="MobileController"
  // __getInnerController, executeScript

  // TODO: Deny : wsbd : nicer why of managing hamburger
  // { status: 'closed', 'transition-in', 'opened', 'transition-out' }
  // asideToggled

  @CustomTheme()

  @Prop() title: string;

  @Prop() controllerName?: string | null;

  @Prop() history: RouterHistory;

  @State() controller: any | null;

  @State() disconnected: boolean | false;

  @State() controllerScript: string | null;

  @Element() private _host: HTMLElement;

  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;

  @State() aside = {
    value: false
  }

  componentWillLoad() {
    let promise;
    if (typeof this.controllerName === "string" && this.controllerName.length > 0) {
      promise = ControllerRegistryService.getController(this.controllerName);
    } else {
      promise = Promise.resolve(DefaultContainerController);
    }

    promise
      .then(Controller => {
        if (!this.disconnected) {
          this.controller = new Controller(this._host, this.history);
          this.__getInnerController.call(this, this._host);
          if (this.controllerScript) {
            this.executeScript(this.controllerScript);
          }
      }})
      .catch(err => console.log(err));

    return promise;
  }

  __getInnerController(fromElement: HTMLElement): void {
    const children:HTMLCollection = fromElement.children;
    // Find only the first direct <script> descendant
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.tagName.toLowerCase() !== 'script') {
        continue;
      }

      this.controllerScript = child.innerHTML;
      child.innerHTML = '';
      return;
    }
  }

  executeScript(script) {
    if (typeof script === 'string' && script.trim().length > 0) {
      new Function('controller', script)(this.controller);
    }
    return null;
  }

  asideToggled(e) {
    e.preventDefault();
    this.aside = {
      ...this.aside,
      value: !this.aside.value
    };
  }

  render() {
    return (
      <div class='mobile'>
        <header>
          <div class='back-toggler'>
            <psk-button>
              <psk-icon icon='chevron-left'/>
            </psk-button>
          </div>
          <div class='aside-toggler'>
            <psk-button onClick={(e) => this.asideToggled(e)}>
              <psk-icon icon='bars'/>
            </psk-button>
          </div>
          <h1 class='title'>{this.title}</h1>
          <div class='options-toggler'>
            <psk-button>
              <psk-icon icon='ellipsis-v'/>
            </psk-button>
          </div>
          {
            this.aside.value ? (
              <div class='aside-menu'>
                <psk-user-profile/>
                <app-menu hamburger-max-width={0} item-renderer='sidebar-renderer'/>
              </div>
            ) : null
          }
          <div class='options-menu'>
          </div>
        </header>
        <main>
          <slot name='content'/>
        </main>
        <footer>
          <slot name='footer'/>
        </footer>
      </div>
    )
  }
}