import { Component, Event, EventEmitter, Prop, h, State } from "@stencil/core";
import { MenuItem } from "../../interfaces/MenuItem";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";
import { ExtendedHistoryType } from "../../interfaces/ExtendedHistoryType";

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
  @Prop() routesItems?: MenuItem[] = [];

  @TableOfContentProperty({
    description: `This is the history type that will be passed along to the stencil-router`,
    isMandatory: false,
    propertyType: `string`,
    defaultValue: `browser`
  })
  @Prop() historyType: ExtendedHistoryType;
  @Prop() failRedirectTo: string = "";

  @TableOfContentEvent({
    eventName: `needRoutes`,
    controllerInteraction: {
      required: true
    },
    description: `This event gets the data as parameter and it is emitted immediately after the component is loaded in order to create the application routes `
  })
  @Event({
    eventName: 'needRoutes',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) needRoutesEvt: EventEmitter;


  @TableOfContentEvent({
    eventName: `getHistoryType`,
    controllerInteraction: {
      required: true
    },
    description: `This event gets the history type `
  })
  @Event({
    eventName: 'getHistoryType',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getHistoryType: EventEmitter;

  @State() notFoundRoute: string = null;

  componentDidLoad() {
    this.needRoutesEvt.emit((err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      this.routesItems = data;
    });

    this.getHistoryType.emit((err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      this.historyType = data;
    })
  }

  renderItems(items) {
    let routes = [];
    if (typeof items === "object") {
      routes = items.map((item) => {
        if (item.name == "404") {
          this.notFoundRoute = item.path;
        }

        if (item.children && item.children.type === "known") {
          return this.renderItems(item.children.items)
        } else {
          return <stencil-route url={item.path} component={item.component}
                                componentProps={item.componentProps}/>
        }
      });
    }
    return routes;
  }

  render() {
    let routes = this.renderItems(this.routesItems);

    if (routes.length === 0) {
      return <psk-ui-loader shouldBeRendered={true} />
    }

    if (!this.notFoundRoute) {
      this.notFoundRoute = this.routesItems[0].path;
    }

    return (
      <div class="app_container">
        <stencil-router historyType={this.historyType === "query" ? "browser" : this.historyType}>

          <stencil-route-switch scrollTopOffset={0}>
            {this.historyType === "query" ?
              <stencil-route component="query-pages-router" componentProps={{ pages: this.routesItems }} /> :
              [<stencil-route url="/" exact={true} component="psk-route-redirect"
                              componentProps={{url:this.routesItems[0].path}}/>,
                routes,
                <stencil-route component="psk-page-not-found"
                  componentProps={{ urlDestination: this.notFoundRoute }} />]}
          </stencil-route-switch>

        </stencil-router>
      </div>)
  }
}
