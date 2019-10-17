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

  renderItems(items) {
    let routes = items.map((item) => {
      if (item.children) {
        return this.renderItems(item.children)
      } else {
        return <stencil-route url={item.path} exact={item.exactMatch} component={item.component}
                              componentProps={item.componentProps}/>
      }
    });
    return routes;
  }

  render() {

    let routes = this.renderItems(this.menuItems);

    if(routes.length === 0){
      return <psk-ui-loader shouldBeRendered={true} />
    }

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
