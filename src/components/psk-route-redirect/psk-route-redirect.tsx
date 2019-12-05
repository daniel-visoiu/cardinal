import {Component, Prop} from "@stencil/core";
import {injectHistory, RouterHistory} from "@stencil/router";

@Component({
  tag: "psk-route-redirect",

})
export class PskRouteRedirect {

  @Prop() url;
  @Prop() history: RouterHistory;

  componentWillLoad() {
    this.history.push(this.url, {});
  }
}

injectHistory(PskRouteRedirect);
