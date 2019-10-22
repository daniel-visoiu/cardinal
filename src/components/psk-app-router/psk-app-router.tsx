import {Component, Event, EventEmitter, Prop, h} from "@stencil/core";
import {MenuItem} from "../../interfaces/MenuItem";

@Component({
  tag: "psk-app-router",
  shadow: true
})
export class PskAppRouter {
  @Prop() menuItems ?: MenuItem[] = [];
  @Prop() failRedirectTo:string = "";
  @Prop() historyType:string = "browser";

  @Event({
    eventName: 'needMenuItems',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needMenuItemsEvt: EventEmitter;


  componentDidLoad() {
    this.needMenuItemsEvt.emit((data) => {
      this.menuItems = data;
    });
  }

  renderItems(items) {
    let routes = items.map((item) => {
      if (item.children) {
        return this.renderItems(item.children)
      } else {
        return <stencil-route url={item.path} exact={item.exact} component={item.component}
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
        <stencil-router historyType={this.historyType} >
          <stencil-route-switch scrollTopOffset={0}>
            {routes}
            <stencil-route component="psk-page-not-found" componentProps={{urlDestination:this.menuItems[0].path, }} />
          </stencil-route-switch>
        </stencil-router>
      </div>)
  }
}
