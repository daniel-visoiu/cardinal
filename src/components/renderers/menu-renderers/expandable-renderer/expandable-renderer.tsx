import {Component, getElement, h, Listen,  Prop, State} from '@stencil/core';
import {injectHistory, RouterHistory} from "@stencil/router";

@Component({
  tag: 'expandable-renderer',
  shadow: false
})

export class ExpandableRenderer {

  @Prop({
    reflectToAttr: true,
  }) active: boolean;
  @State() isOpened = false;
  @Prop() url;
  @State() dropDownHasChildActive = false;
  @Prop() somethingChanged = false;
  @Prop() firstMenuChild :any;
  @Prop() history: RouterHistory;

  @Listen("click", {capture: false, target: "window"})
  handleClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!getElement(this).contains(target)) {
      this.isOpened = false;
    }
  }

  @Listen("routeChanged", {capture: false, target: "window"})
  routeChanged() {
    this.dropDownHasChildActive = window.location.href.includes(this.url);
  }

  toggleDropdown(evt) {

    let target = evt.target;
    let isChild = false;

    while(target.parentElement){
      target = target.parentElement;
      if(target.classList.contains("children")){
        isChild = true;
        break;
      }
    }
    if(!isChild){
      if(!this.isOpened){
        this.history.push(this.firstMenuChild.path);
      }
      evt.stopImmediatePropagation();
    }
    this.isOpened = !this.isOpened;
  }

  render() {
    this.routeChanged();
    return (
      <div class={`dropdown ${this.dropDownHasChildActive?"active":''} ${this.isOpened ? "isOpened" : ''}`} onClick={(evt) => this.toggleDropdown(evt)}>
        <slot/>
      </div>
    )
  }
}
injectHistory(ExpandableRenderer);
