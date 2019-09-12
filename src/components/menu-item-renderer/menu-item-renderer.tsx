import {Component, h, Prop} from '@stencil/core';
import CustomTheme from "../../decorators/CustomTheme";

export interface MenuItem {
  name: string
}

@Component({
  tag: 'menu-item-renderer',
  styleUrl: '../../themes/default/components/menu-item-renderer/menu-item-renderer.css',
  shadow: true
})

export class MenuItemRenderer {
  @CustomTheme()
  @Prop() value: MenuItem;


  renderMenuItem(item){
    let children = [];
    if(item.children){
      item.children.forEach((child)=>{
        children.push(this.renderMenuItem(child));
      })
    }
    return (
      <a>
        {item.name}
        {children}
      </a>
    )
  }

  render() {
    return (this.renderMenuItem(this.value));
  }
}
