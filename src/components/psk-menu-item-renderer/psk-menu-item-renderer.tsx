import {Component, h, Prop} from '@stencil/core';
import {MenuItem} from "../../interfaces/MenuItem";

@Component({
  tag: 'psk-menu-item-renderer',
  styleUrl: '../../themes/default/components/psk-menu-item-renderer/psk-menu-item-renderer.css',
  shadow: true
})

export class PskMenuItemRenderer {
  @Prop() value: MenuItem;
  @Prop({
    reflectToAttr: true,
  }) active: boolean;

  renderMenuItem(item) {
    let href = item.path;
    let children = [];
    if (item.children) {
      item.children.forEach((child) => {
        children.push(this.renderMenuItem(child));
      })
    }

    let ItemWrapperTag = item.type === "abstract" ? "dropdown-renderer" : "stencil-route-link";

    return (
      <ItemWrapperTag url={href} activeClass="active" exact={false} somethingChanged={this.value}>
        <div class="wrapper_container">
          <div class="item_container">
            <span class={`icon fa ${item.icon}`}></span>
            <a>
              {item.children ? <span class="item_name">{item.name}<span class="fa fa-caret-down"></span></span> :
                <span class="item_name">{item.name}</span>}
            </a>
          </div>
          {item.children ? <div class="children">
            {children}
          </div> : null}
        </div>
      </ItemWrapperTag>
    )
  }

  render() {
    return (this.renderMenuItem(this.value))
  }
}
