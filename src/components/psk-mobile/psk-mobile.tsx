import { Component, Prop, State, Element, Listen, h } from "@stencil/core";
import { RouterHistory } from "@stencil/router";

import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import ControllerRegistryService from "../../services/ControllerRegistryService";

@Component({
  tag: 'psk-mobile',
  styleUrl: './psk-mobile.css',
  shadow: true
})

export class PskMobile {
  @CustomTheme()

  @TableOfContentProperty({
    description: `This property is used as title for the page.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() title: string = '';

  @TableOfContentProperty({
    description: `This property decides if the hamburger button and the sidebar attached with it should be rendered.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop() disableSidebar: boolean = false;

  @TableOfContentProperty({
    description: `This property decides if the return / go back button should be displayed.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop() enableBack: boolean = false;

  @TableOfContentProperty({
    description: [
      `This property is a string that will permit the developer to choose his own controller.`,
      `If no value is sent then the null default value will be taken and the component will use the basic Controller.`
    ],
    propertyType: `string`,
    isMandatory: false,
    defaultValue: `null`
  })
  @Prop() controllerName?: string | null;

  @Prop() history: RouterHistory;

  @Element() private _host: HTMLElement;

  @State() controller: any | null;

  @State() aside = {
    disabled: this.disableSidebar,
    hidden: true
  }

  @State() options = {
    disabled: true,
    hidden: true
  }

  toggleAside(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.aside = {
      ...this.aside,
      hidden: !this.aside.hidden
    };
    this.options = {
      ...this.options,
      hidden: true
    }
  }

  toggleBack(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    window.history.back();
  }

  toggleOptions(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.options = {
      ...this.options,
      hidden: !this.options.hidden
    }
    this.aside = {
      ...this.aside, hidden: true
    };
  }

  @Listen('click')
  onHandleClickEvent(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const tree: Array<EventTarget> = e.composedPath();
    const main = this._host.shadowRoot.querySelector('main');

    for (const elem of tree) {
      if (elem === main) {
        this.aside = {
          ...this.aside,
          hidden: true
        };
        this.options = {
          ...this.options,
          hidden: true
        }
      }
    }
  }

  async componentWillLoad() {
    if (this._host.querySelector('[slot="options"]')) {
      this.options.disabled = false;
    }

    if (typeof this.controllerName === "string") {
      try {
        const Controller = await ControllerRegistryService.getController(this.controllerName);
        this.controller = new Controller(this._host, this.history);
      } catch (err) {
        console.error(err);
      }
    }
  }

  render() {
    return (
      <div class='mobile'>
        <header>
          <div class='back-toggler'>
          {
            this.enableBack ? (
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
          <div class='main-cover' hidden={this.aside.hidden} />
          <slot name='content'/>
        </main>
        <footer>
          <slot name='footer'/>
        </footer>
      </div>
    )
  }
}
