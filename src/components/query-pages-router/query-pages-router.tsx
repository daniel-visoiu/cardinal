import {Component, h, Element, Prop, Watch, State} from '@stencil/core';
import {LocationSegments, RouterHistory, injectHistory} from "@stencil/router";
import {MenuItem} from "../../interfaces/MenuItem";
import {HTMLStencilElement} from "@stencil/core/internal";

@Component({
  tag: 'query-pages-router',
  shadow: true
})
export class QueryPagesRouter {

  @Prop() history: RouterHistory;
  @Prop() pages: MenuItem[];
  @State() routes = {};
  @State() currentRoute;
  @Element() el: HTMLStencilElement;
  @Prop() location: LocationSegments;

  componentWillLoad() {

    let routes = {};
    let renderItems = function (pages) {

      pages.forEach((item) => {
        if (item.children) {
          renderItems(item.children)
        } else {
          let {path, component, componentProps} = item;
          routes[path] = ({component, componentProps});
        }
      });

      return routes;
    };

    this.routes = renderItems(this.pages);
  }

  @Watch('location')
  locationChanged(newValue: LocationSegments) {
    this.currentRoute = newValue;
  }

  render() {
    let currentRouteSearchUrl = this.currentRoute.search;
    if (currentRouteSearchUrl.indexOf("&") !== -1) {
      currentRouteSearchUrl = currentRouteSearchUrl.substring(0, currentRouteSearchUrl.indexOf("&"))
    }

    let currentRoute = this.routes[currentRouteSearchUrl];

    let componentName = "psk-page-not-found";
    let componentProps = {urlDestination: this.pages[0].path};

    if (currentRoute) {
      componentName = currentRoute.component;
      componentProps = currentRoute.componentProps;
    }

    return (
      <stencil-route component={componentName}
                     componentProps={componentProps}/>)


  }
}

injectHistory(QueryPagesRouter);
