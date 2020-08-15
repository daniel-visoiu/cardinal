import {Component, Event, EventEmitter, h, Listen, Prop, State} from '@stencil/core';
import {injectHistory, RouterHistory} from "@stencil/router";

@Component({
  tag: 'expandable-renderer',
  shadow: false
})

export class ExpandableRenderer {

  @Prop({
    reflect: true,
  }) active: boolean;
  @State() isOpened = false;
  @Prop() url;
  @State() dropDownHasChildActive = false;
  @Prop() somethingChanged = false;
  @Prop() firstMenuChild: any;
  @Prop() history: RouterHistory;

  @Event({
    eventName: 'sectionChange',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) sectionChange: EventEmitter;

  @Listen("sectionChange", {capture: false, target: "window"})
  routeChanged() {
    this.dropDownHasChildActive = window.location.href.includes(this.url);
      if(this.dropDownHasChildActive){
        this.isOpened = true;
      }
  }

  openDropDown(evt) {

    let target = evt.target;
    let isChild = true;

    while (target.parentElement) {
      target = target.parentElement;
      if(target.classList.contains("wrapper_container")){
        if(target.querySelector(".children")!== null){
          isChild = false;
          break;
        }
      }
    }

    if (!isChild) {
      if (!this.isOpened) {
        this.history.push(this.firstMenuChild.path);
        this.sectionChange.emit();
        //prevent propatation, otherwise, on mobile version, the menu will be closed
        evt.stopImmediatePropagation();
      }
    }
    this.isOpened = true;
  }

  closeSection(evt) {
    this.isOpened = false;
    this.dropDownHasChildActive = false;
    evt.stopImmediatePropagation();
  }

  componentWillLoad() {
    this.routeChanged();
  }

  render() {
    return (
      <div class={`dropdown ${this.dropDownHasChildActive ? "active" : ''} ${this.isOpened ? "isOpened" : ''}`}
           onClick={this.openDropDown.bind(this)}>
        {this.isOpened ?
          <button class="close-section" onClick={this.closeSection.bind(this)}></button> : null}

        <slot/>
      </div>
    )
  }
}

injectHistory(ExpandableRenderer);
