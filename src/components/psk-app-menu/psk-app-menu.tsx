import { Component, Listen, Prop, State, Event, EventEmitter, h } from '@stencil/core';

import { MenuItem } from "../../interfaces/MenuItem";
import { ExtendedHistoryType } from "../../interfaces/ExtendedHistoryType";

import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';

import { MOBILE_MAX_WIDTH } from "../../utils/constants";

@Component({
  tag: 'psk-app-menu',
  styleUrl:"../../assets/css/bootstrap/bootstrap.css",
  shadow: true
})

export class PskAppMenu {
  @CustomTheme()

  @TableOfContentProperty({
    description:
      `Another web component that can render each menu item.
      This component is responsible for rendering children (nested menu items).`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() itemRenderer?: string;

  @TableOfContentProperty({
    description:
      `Menu items datasource. It should be an array of MenuItem[].
      If it is not provided, it the component will emit an event (needMenuItems) in order to get the menu items.`,
    isMandatory: false,
    propertyType: `array of MenuItem items (MenuItem[])`,
    defaultValue: `null`
  })
  @Prop() menuItems?: MenuItem[] = null;

  @TableOfContentProperty({
    description: `This property is intended to be added when you want to change the default value of ${MOBILE_MAX_WIDTH}px for switching between normal and hamburger menu.`,
    isMandatory: false,
    propertyType: `number`,
    defaultValue: MOBILE_MAX_WIDTH
  })
  @Prop() hamburgerMaxWidth?: number = MOBILE_MAX_WIDTH;

  @Prop() historyType: ExtendedHistoryType;

  @State() showHamburgerMenu?: boolean = false;
  @State() showNavBar: boolean = false;

  @TableOfContentEvent({
    eventName: `menuEvent`,
    controllerInteraction: {
      required: true
    },
    description: `This event will be emitted when you click on a menu item and it will create another CustomEvent that will change your route to the page you want to access.`
  })
  @Event({
    eventName: 'menuEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) menuItemClicked: EventEmitter;

  @TableOfContentEvent({
    eventName: `needMenuItems`,
    controllerInteraction: {
      required: true
    },
    description: `If no data is provided for the menuItems property this event will be emitted and a default menu will be rendered.`
  })
  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;

  @TableOfContentEvent({
    eventName: `getHistoryType`,
    controllerInteraction: {
      required: true
    },
    description: `This event gets the history type.`
  })
  @Event({
    eventName: 'getHistoryType',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getHistoryType: EventEmitter;

  @Listen("resize", { capture: true, target: 'window' })
  checkIfHamburgerIsNeeded() {
    this.showHamburgerMenu = document.documentElement.clientWidth < this.hamburgerMaxWidth;
  }

  componentDidLoad() {
    this.checkIfHamburgerIsNeeded();
    this.getHistoryType.emit((err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      this.historyType = data;
    })
  }

  handleClick(ev) {
    ev.preventDefault();

    let item = ev.target.value;
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].active = item === this.menuItems[i];
    }

    this.menuItemClicked.emit(ev.target.value);
    //forcing a re-rendering
    this.menuItems = [...this.menuItems];
  }

  toggleNavBar() {
    this.showNavBar = !this.showNavBar;
  }

  componentWillLoad() {
    if (!this.menuItems) {
      this.needMenuItemsEvt.emit((err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        this.menuItems = data;
      });
    }
  }

  renderItem(menuItem) {
    let ItemRendererTag = this.itemRenderer ? this.itemRenderer : "psk-menu-item-renderer";

    let children = [];

    if (menuItem.children) {
      for (let i = 0; i < menuItem.children.length; i++) {
        children.push(this.renderItem(menuItem.children[i]))
      }
    }
    return <ItemRendererTag onclick={(event) => this.handleClick(event)}
      historyType={this.historyType}
      active={menuItem.active ? menuItem.active : false}
      children={children}
      hamburger={this.showHamburgerMenu}
      value={menuItem} />
  }

  renderMenuItems() {
    let renderComponent = [];
    for (let i = 0; i < this.menuItems.length; i++) {
      let menuItem = this.menuItems[i];
      renderComponent.push(this.renderItem(menuItem));
    }

    if (this.showHamburgerMenu) {
      renderComponent = renderComponent.map((item) => {
        return <li onClick={this.toggleNavBar.bind(this)} class="nav-item">{item}</li>
      });

      let navBarClass = "collapse navbar-collapse " + `${this.showNavBar == true ? 'show' : ''}`;
      return (
        <nav class="navbar navbar-dark ">
          <a class="navbar-brand" href="#"/>
          <button class="navbar-toggler" type="button" data-toggle="collapse" onClick={this.toggleNavBar.bind(this)}
                  aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"/>
          </button>
          <div class={navBarClass}>
            <slot name="before"/>
            <ul class="navbar-nav mr-auto">
              {renderComponent}
            </ul>
            <slot name="after"/>
          </div>
        </nav>
      )
    } else {
      return [
        <slot name="before"/>,
        <div class="menu_container">
          {renderComponent}
        </div>,
        <slot name="after"/>
      ];
    }
  }

  render() {
    if (!this.menuItems) return null;
    return this.renderMenuItems();
  }
}
