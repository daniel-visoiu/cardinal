import {Component, h, Prop, Element, Event, EventEmitter,Listen} from '@stencil/core';
import MenuController from "../../controllers/MenuController";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'app-menu',
  styleUrl: '../../themes/default/components/app-menu/app-menu.css',
  shadow: true
})
export class AppMenu {
  @CustomTheme({}) theme;
  @Prop() controller: any;
  @Prop() itemRenderer: string;
  @Prop() onMenuChanged ?:any;
  @Element() el: HTMLElement;
  @Event({
    eventName: 'menuEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) menuItemClicked:EventEmitter;

  @Listen('click', {capture: true})
  handleClick(ev) {
    console.log("menu-clicked");
    this.menuItemClicked.emit(ev)}

  render() {
    if (!this.controller) {
      console.log("No controller");
      this.controller = new MenuController(this.el);
    }

    let menuItems = this.controller.getMenuItems();

    let renderComponent = [];
    for (let i = 0; i < menuItems.length; i++) {
      // @ts-ignore
      renderComponent.push(<a path={menuItems[i].path} >{menuItems[i].name}</a>)
    }
    return renderComponent;
  }
}
