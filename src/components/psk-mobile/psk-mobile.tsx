import { Component, Prop, State, Event, Element, EventEmitter, h } from '@stencil/core';
import { RouterHistory } from "@stencil/router";

import CustomTheme from "../../decorators/CustomTheme";
import { BindModel } from "../../decorators/BindModel";
import ControllerRegistryService from "../../services/ControllerRegistryService";

@Component({
  tag: 'psk-mobile',
  shadow: true
})

export class PskMobile {
  @CustomTheme()

  @BindModel() modelHandler;

  @Element() private _host: HTMLElement;

  @Prop() title: string;

  @Prop() disableSidebar: boolean = false;

  @Prop() disableBack: boolean = true;

  @Prop() history: RouterHistory;

  @Prop() controllerName?: string | null;

  @State() controller: any | null;

  @State() disconnected: boolean | false;

  @State() aside = {
    disabled: this.disableSidebar,
    hidden: true
  }
  @State() options = {
    disabled: true,
    hidden: true
  }

  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;

  toggleAside(e) {
    e.preventDefault();
    this.aside = {
      ...this.aside,
      hidden: !this.aside.hidden
    };
  }

  toggleBack(e) {
    e.preventDefault();
    window.history.back();
  }

  toggleOptions(e) {
    e.preventDefault();
    this.options = {
      ...this.options,
      hidden: !this.options.hidden
    }
  }

  componentWillLoad() {
    if (this._host.querySelector('[slot="options"]')) {
      this.options.disabled = false;
    }

    const promisifyControllerLoad = (controllerName) => {
      return new Promise((resolve, reject) => {
        ControllerRegistryService.getController(controllerName).then((controller) => {
          // Prevent javascript execution if the node has been removed from DOM
          resolve(controller);
        }).catch(reject);
      })
    };

    if (typeof this.controllerName === "string") {
      let promise;
      promise = promisifyControllerLoad(this.controllerName);
      promise.then((Controller) => {
        if (!this.disconnected) {
          this.controller = new Controller(this._host, this.history);
        }
      }).catch((err) => {
        console.log(err);
      });
      return promise;
    }
  }

  render() {
    return (
      <div class='mobile'>
        <header>
          <div class='back-toggler'>
          {
            !this.disableBack ? (
              <psk-button onClick={e => this.toggleBack(e)}>
                <psk-icon icon='chevron-left'/>
              </psk-button>
            ) : null
          }
          </div>
          <div class='aside-toggler'>
            {
              !this.aside.disabled ? (
                <psk-button onClick={e => this.toggleAside(e)}>
                  <psk-icon icon='bars'/>
                </psk-button>
              ) : null
            }
          </div>
          <h1 class='title'>{this.title}</h1>
          <div class='options-toggler'>
          {
            !this.options.disabled ? (
              <psk-button onClick={e => this.toggleOptions(e)}>
                <psk-icon icon='ellipsis-v'/>
              </psk-button>
            ) : null
          }
          </div>
          <div class='aside-menu' hidden={this.aside.hidden}>
            <psk-user-profile/>
            <app-menu hamburger-max-width={0} item-renderer='sidebar-renderer'/>
          </div>
          <div class='options-menu' hidden={this.options.hidden}>
            <slot name='options'/>
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
