import {Component, h, Prop, Element} from '@stencil/core';
import MenuController from "../../controllers/MenuController";

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.css',
  shadow: true
})
export class AppMenu {
  @Prop() controller: any;
  @Prop() itemRenderer: string;
  @Prop() onMenuChanged ?:any;
  @Element() el: HTMLElement;


  triggerEvent(ev){
    console.log(this.el);
    ev.stopImmediatePropagation();
    console.log(ev.target);
    var event = new CustomEvent('MenuEvent');
    this.el.dispatchEvent(event);
    //dispatch using component instance view this.something...
  }
  render() {
    console.log("Render");
    if (!this.controller) {
      console.log("No controller");
      this.controller = new MenuController(this.el);
    }

    let menuItems = this.controller.getMenuItems();
    console.log(menuItems);
    let renderComponent = [];
    for (let i = 0; i < menuItems.length; i++) {
      // @ts-ignore
      renderComponent.push(<a onclick={(event)=>this.triggerEvent(event)} path={menuItems[i].path} >{menuItems[i].name}</a>)
    }
    return renderComponent;
  }
}
