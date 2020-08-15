import {Component, getElement, h, Listen,  Prop, State} from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';

@Component({
  tag: 'dropdown-renderer',
  shadow: false
})

export class DropdownRenderer {


  @TableOfContentProperty({
    description:`This property is used in the css file for renderes in order to verify the state of the component`,
    isMandatory: false,
    propertyType: `boolean`
  })
  @Prop({
    reflect: true,
  }) active: boolean;

  @State() isOpened = false;

  @TableOfContentProperty({
    description: `This property sets the url for the component in menu in order to be routed.`,
    isMandatory: true,
    propertyType: 'any'
  })
  @Prop() url;

  @State() dropDownHasChildActive = false;

  @TableOfContentProperty({
    description: `This property tells the component if something changed with the MenuItem`,
    isMandatory: false,
    propertyType: 'boolean'
  })
  @Prop() somethingChanged = false;

  @Listen("click", {capture: true, target: "window"})
  handleClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!getElement(this).contains(target)) {
      this.isOpened = false;
    }
  }

  @Listen("menuClicked", {capture: true, target: "window"})
  handleMenuClick(e: CustomEvent) {
    const target = e.detail as HTMLElement;
    if (getElement(this).contains(target)) {
      this.isOpened = false;
    }else{
      this.dropDownHasChildActive = false;
    }
  }

  @Listen("routeChanged", {capture: false, target: "window"})
  routeChanged() {
    let url = this.url+"/";
    this.dropDownHasChildActive = window.location.href.includes(url);
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
