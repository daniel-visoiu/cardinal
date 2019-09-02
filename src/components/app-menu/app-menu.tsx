import {Component, h, Prop, Element, Event, EventEmitter} from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'app-menu',
  styleUrl: '../../themes/default/components/app-menu/app-menu.css',
  shadow: true
})
export class AppMenu {
  @CustomTheme({}) theme;
  @Prop() controller: any;
  @Prop() itemRenderer?: string;
  @Prop() onMenuChanged ?:any;
  @Element() el: HTMLElement;
  @Event({
    eventName: 'menuEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) menuItemClicked:EventEmitter;


  handleClick(ev) {
    ev.preventDefault();
    this.menuItemClicked.emit(ev.target.value)}

  render() {
    let ItemRendererTag = "menu-item-renderer";
    if(this.itemRenderer){
       ItemRendererTag = this.itemRenderer;
    }

    let menuItems = this.controller.getMenuItems();

    let renderComponent = [];
    for (let i = 0; i < menuItems.length; i++) {
      renderComponent.push(<ItemRendererTag  onclick={(event)=>this.handleClick(event)} active={true} value={menuItems[i].path} >{menuItems[i].name}</ItemRendererTag>)
    }
    return renderComponent;
  }
}
