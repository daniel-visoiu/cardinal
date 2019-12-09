import {Component, Prop} from "@stencil/core";
import {injectHistory, RouterHistory} from "@stencil/router";

@Component({
  tag: "psk-route-redirect",
})
export class PskRouteRedirect {

  @Prop() url;
  @Prop() history: RouterHistory;

  componentWillLoad() {
    if(this.url){
      this.history.push(this.url, {});
    }
    else{
      console.error("Url was not provided")
    }
  }
}

injectHistory(PskRouteRedirect);
