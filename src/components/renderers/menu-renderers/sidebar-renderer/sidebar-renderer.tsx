import {Component, h, Prop} from '@stencil/core';
import {MenuItem} from "../../../../interfaces/MenuItem";
import CustomTheme from "../../../../decorators/CustomTheme";

@Component({
  tag: 'sidebar-renderer',
  shadow: true
})

export class SidebarRenderer {
  @CustomTheme()
  @Prop() value: MenuItem;
  @Prop({
    reflectToAttr:true,
  }) active: boolean;


  renderMenuItem(item) {
    let href = item.path;
    let children = [];
    if (item.children) {
      item.children.forEach((child) => {
        children.push(this.renderMenuItem(child));
      })
    }

    let ItemWrapperTag = item.type === "abstract" ? "expandable-renderer" : "stencil-route-link";

    return (
      <ItemWrapperTag firstMenuChild = {item.children?item.children[0]:""} url={href} activeClass="active" exact={false} somethingChanged={this.value}>
        <div class="wrapper_container">
          <div class="item_container">
            <span class={`icon fa ${item.icon}`}></span>
              {item.children ? <span class="item_name">{item.name}</span> :
                <span class="item_name">{item.name}</span>}
            {item.children ? <span class="fa fa-caret-right expand-menu"></span>:null}
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
