import {Component, Event, EventEmitter, Prop, h} from "@stencil/core";
import {MenuItem} from "../../interfaces/MenuItem";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";

@Component({
  tag: "psk-app-router",
  shadow: true
})
export class PskAppRouter {

  @TableOfContentProperty({
    description: `This parameter holds the datasource for the creation of the application routes. If this property is not provided, the component will emit an event (needMenuItems) in order to fetch this information.`,
    specialNote: `The same configuration file is used in generating the App Menu component`,
    isMandatory: false,
    propertyType: `Array of MenuItem types(MenuItem[])`
    
  })
  @Prop() menuItems ?: MenuItem[] = [];

  @TableOfContentProperty({
    description:`This is the history type that will be passed along to the stencil-router`,
    isMandatory: false,
    propertyType:`string`,
    defaultValue: `browser`
  })
  @Prop() historyType:string = "browser";

  @TableOfContentEvent({
    eventName: `needMenuItems`,
    description:`This event gets the data as parameter and it is emitted immediately after the component is loaded in order to create the application routes `
  })
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
