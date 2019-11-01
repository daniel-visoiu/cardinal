import { Component, h, Prop, Event, EventEmitter, Listen, State } from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";
import { MenuItem } from "../../interfaces/MenuItem";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';

@Component({
  tag: 'app-menu',
  styleUrl: '../../themes/default/components/app-menu/app-menu.css',
  shadow: true
})
export class AppMenu {
  @CustomTheme()

  @TableOfContentProperty({
    description: `Another web component that can render each menu item.
     This component is responsible for rendering children (nested menu items).`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() itemRenderer?: string;

  @TableOfContentProperty({
    description: `Menu items datasource. It should be an array if MenuItem[]. 
      If it is not provided, it the component will emit an event (needMenuItems) in order to get the menu items.`,
    isMandatory: false,
    propertyType: `array of MenuItem items (MenuItem[])`,
    defaultValue: `null`
  })
  @Prop() menuItems?: MenuItem[] = null;

  @TableOfContentProperty({
    description: `This property is intended to be added when you want to change the default value of 600px for switching between normal and hamburger menu.`,
    isMandatory: false,
    propertyType: `number`,
    defaultValue: `600`
  })
  @Prop() hamburgerMaxWidth?: number = 600;

  @State() showHamburgerMenu?: boolean = false;
  @State() showNavBar: boolean = false;

  @TableOfContentEvent({
    eventName: `menuEvent`,
    description: `This event will be emited when you click on a menu item and it will create another CustomEvent that will change your route to the page you want to access.`
  })
  @Event({
    eventName: 'menuEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) menuItemClicked: EventEmitter;

  @TableOfContentEvent({
    eventName: `needMenuItems`,
    description: `If no data is provided for the menuItems property this event will be emited that will render a default menuItem created by us.`
  })
  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;


  @Listen("resize", { capture: true, target: 'window' })
  checkIfHamburgerIsNeeded() {
    this.showHamburgerMenu = document.documentElement.clientWidth < this.hamburgerMaxWidth;
  }

  componentDidLoad() {
    this.checkIfHamburgerIsNeeded();
  }

  handleClick(ev) {
    ev.preventDefault();

    let item = ev.target.value;
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].active = item === this.menuItems[i];
    }

    this.menuItemClicked.emit(ev.target.value);
    //forcing a rerendering
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
      active={menuItem.active ? menuItem.active : false}
      children={children}
      hamburger={this.showHamburgerMenu}
      value={menuItem} />
  }

  render() {

    if (!this.menuItems) {
      return;
    }

    let renderComponent = [];
    for (let i = 0; i < this.menuItems.length; i++) {
      let menuItem = this.menuItems[i];
      renderComponent.push(this.renderItem(menuItem));
    }

    let activeItem = this.menuItems.find((item) => {
      return item.active;
    });

    if (this.showHamburgerMenu) {

      renderComponent = renderComponent.map((item) => {
        return <li onClick={this.toggleNavBar.bind(this)} class="nav-item">{item}</li>
      });

      let navBarClass = "collapse navbar-collapse " + `${this.showNavBar == true ? 'show' : ''}`;
      return (<nav class="navbar navbar-dark ">
        <a class="navbar-brand" href="#">{activeItem ? activeItem.name : "Home"}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" onClick={this.toggleNavBar.bind(this)}
          aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class={navBarClass}>

          <ul class="navbar-nav mr-auto">
            {renderComponent}
          </ul>

        </div>

      </nav>)
    } else {
      return renderComponent
    }
  }
}
