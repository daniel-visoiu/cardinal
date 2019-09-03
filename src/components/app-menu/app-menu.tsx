import {Component, h, Prop, Element, Event, EventEmitter, Watch} from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'app-menu',
  styleUrl: '../../themes/default/components/app-menu/app-menu.css',
  shadow: true
})
export class AppMenu {
  @CustomTheme()
  @Prop() controller: any;
  @Prop() itemRenderer?: string;
  @Prop() onMenuChanged ?: any;
  @Prop() menuItems ?: any;
  @Element() el: HTMLElement;
  @Event({
    eventName: 'menuEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) menuItemClicked: EventEmitter;

  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;


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

  componentWillLoad() {
    this.needMenuItemsEvt.emit((data) => {
      this.menuItems = data;
    });
  }


  render() {
    let ItemRendererTag = this.itemRenderer ? this.itemRenderer : "menu-item-renderer";

    let renderComponent = [];
    for (let i = 0; i < this.menuItems.length; i++) {
      renderComponent.push(<ItemRendererTag onclick={(event) => this.handleClick(event)} active={this.menuItems[i].active?this.menuItems[i].active:false}
                                            value={this.menuItems[i]}/>)
    }
    return renderComponent;
  }
}
