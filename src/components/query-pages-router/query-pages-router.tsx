import { Component, h, Element, Prop, Watch, State } from '@stencil/core';
import { LocationSegments, RouterHistory, injectHistory } from "@stencil/router";
import { MenuItem } from "../../interfaces/MenuItem";
import { HTMLStencilElement } from "@stencil/core/internal";

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
  @Prop() redirectTo: string = "";

  componentWillLoad() {

    let routes = {};
    let renderItems = function (pages) {
      pages.forEach((page) => {
        if (page.children && page.children.type === "known") {
          renderItems(page.children.items)
        } else {
          let { path, component, componentProps } = page;
          routes[path] = { component, componentProps };
        }
      });

      return routes;
    };

    this.routes = renderItems(this.pages);
  }

  @Watch('location')
  locationChanged(newValue: LocationSegments) {
    this.currentRoute = newValue;
    let basePathname = new URL(window['basePath']).pathname;
    if (basePathname.includes(this.currentRoute.pathname) && this.currentRoute.search === "") {
      this.redirectTo = this.pages[0].path;
    } else {
      let notFoundRoute = this.pages.map((item, index) => item.name == "404" ? index : null).filter(item => item !== null)[0];
      if (notFoundRoute) {
        this.redirectTo = this.pages[notFoundRoute].path;
      } else {
        this.redirectTo = this.pages[0].path;
      }
    }
  }

  render() {
    let currentRouteSearchUrl = this.currentRoute.pathname+this.currentRoute.search;
    if (currentRouteSearchUrl.indexOf("&") !== -1) {
      currentRouteSearchUrl = currentRouteSearchUrl.substring(0, currentRouteSearchUrl.indexOf("&"))
    }

    let currentRoute = this.routes[currentRouteSearchUrl];

    let componentName = "psk-page-not-found";
    let componentProps = { urlDestination: this.redirectTo };

    if (currentRoute) {
      componentName = currentRoute.component;
      componentProps = currentRoute.componentProps;
    }

    return (
      <stencil-route component={componentName}
        componentProps={componentProps} />)


  }
}

injectHistory(QueryPagesRouter);
