import { Component, Prop, State, Watch, Element, ComponentInterface, h } from '@stencil/core';

import {
  RouterHistory,
  Listener,
  LocationSegments,
  injectHistory

} from "@stencil/router";

const isModifiedEvent = (ev: MouseEvent) => (
  ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
);


/**
 * Modified from original component stencil-route-link
 * https://github.com/ionic-team/stencil-router/blob/master/packages/router/src/components/route-link/route-link.tsx
 */
@Component({
  tag: 'query-page-link'
})

export class QueryPageLink implements ComponentInterface {
  @Element() el!: HTMLElement;

  unsubscribe: Listener = () => { return; };

  @Prop() url?: string;
  @Prop() urlMatch?: string;
  @Prop() activeClass: string = 'link-active';
  @Prop() exact: boolean = false;
  @Prop() strict: boolean = true;

  /**
   *  Custom tag to use instead of an anchor
   */
  @Prop() custom: string = 'a';

  @Prop() anchorClass?: string;
  @Prop() anchorRole?: string;
  @Prop() anchorTitle?: string;
  @Prop() anchorTabIndex?: string;
  @Prop() anchorId?: string;

  @Prop() history?: RouterHistory;
  @Prop() location?: LocationSegments;
  @Prop() ariaHaspopup?: string;
  @Prop() ariaPosinset?: string;
  @Prop() ariaSetsize?: number;
  @Prop() ariaLabel?: string;

  @State() match: boolean = false;


  componentWillLoad() {
    this.computeMatch();
  }

  // Identify if the current route is a match.
  @Watch('location')
  computeMatch() {
    if (this.location) {
      let currentRouteUrl = this.location.search;
      if (currentRouteUrl.indexOf("&") !== -1) {
        currentRouteUrl = currentRouteUrl.substring(0, currentRouteUrl.indexOf("&"))
      }
      this.match = currentRouteUrl === this.url;
    }
  }

  handleClick(e: MouseEvent) {

    if (isModifiedEvent(e) || !this.history || !this.url ) {
      return;
    }

    e.preventDefault();
    return this.history.push(this.url);
  }

  // Get the URL for this route link without the root from the router
  render() {
    let anchorAttributes: { [key: string]: any} = {
      class: {
        [this.activeClass]: this.match,
      },
      onClick: this.handleClick.bind(this)
    };

    if (this.anchorClass) {
      anchorAttributes.class[this.anchorClass] = true;
    }

    if (this.custom === 'a') {
      anchorAttributes = {
        ...anchorAttributes,
        href: this.url,
        title: this.anchorTitle,
        role: this.anchorRole,
        tabindex: this.anchorTabIndex,
        'aria-haspopup': this.ariaHaspopup,
        id: this.anchorId,
        'aria-posinset': this.ariaPosinset,
        'aria-setsize': this.ariaSetsize,
        'aria-label': this.ariaLabel
      }
    }
    return (
      <this.custom {...anchorAttributes}>
        <slot />
      </this.custom>
    );
  }
}
injectHistory(QueryPageLink);
