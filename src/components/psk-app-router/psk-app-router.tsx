import {Component, Event, EventEmitter, Prop, h} from "@stencil/core";
import {MenuItem} from "../../interfaces/MenuItem";

@Component({
  tag: "psk-app-router",
  shadow: true
})
export class PskAppRouter {
  @Prop() menuItems ?: MenuItem[] = [];

  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;


  componentWillLoad() {
    this.needMenuItemsEvt.emit((data) => {
      this.menuItems = data;
    });
  }


  render() {
    let routes = this.menuItems.map((menuItem)=>{
      return  <stencil-route url={menuItem.path}  exact={menuItem.exactMatch} component={menuItem.component} componentProps={menuItem.componentProps}/>
    });

    return (
      <div class="app_container">
        <stencil-router>
        <stencil-route-switch scrollTopOffset={0}>
          {routes}
        </stencil-route-switch>
        </stencil-router>
      </div>)
  }
}
