import {Component, getElement, h, Listen,  Prop, State} from '@stencil/core';

@Component({
  tag: 'dropdown-renderer',
  shadow: false
})

export class AppMenuDropdown {

  @Prop({
    reflectToAttr: true,
  }) active: boolean;
  @State() isOpened = false;
  @Prop() url;
  @State() dropDownHasChildActive = false;
  @Prop() somethingChanged = false;

  @Listen("click", {capture: true, target: "window"})
  handleClick(e: Event) {
    const target = e.target as HTMLElement;
    console.log(getElement(this).contains(target), target);
    if (!getElement(this).contains(target)) {
      console.log(this.isOpened);
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
