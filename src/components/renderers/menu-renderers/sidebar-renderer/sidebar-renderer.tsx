import {Component, h, Prop} from '@stencil/core';
import {MenuItem} from "../../../../interfaces/MenuItem";
import CustomTheme from "../../../../decorators/CustomTheme";
import {ExtendedHistoryType} from "../../../../interfaces/ExtendedHistoryType";

@Component({
  tag: 'sidebar-renderer',
  styleUrls:[
    "../../../../../themes/commons/bootstrap/css/bootstrap.css",
    "../../../../../themes/commons/fonts/font-awesome.min.css"],
  shadow: true
})

export class SidebarRenderer {
  @CustomTheme()
  @Prop() value: MenuItem;
  @Prop() historyType: ExtendedHistoryType;
  @Prop({
    reflectToAttr:true,
  }) active: boolean;


  renderMenuItem(item) {
    let href = item.path;
    let children = [];
    if (item.children && item.children.type === "known") {
      item.children.items.forEach((child) => {
        children.push(this.renderMenuItem(child));
      })
    }

    let innerContent = (<div class="wrapper_container">
      <div class={`item_container ${item.children ? "has-children" : ""}`}>
        <span class={`icon fa ${item.icon}`}></span>
        {item.children ? <span class="item_name">{item.name}</span> :
          <span class="item_name">{item.name}</span>}
        {item.children ? <span class="fa fa-caret-right expand-menu"></span> : null}
      </div>
      {item.children ? <div class="children">
        {children}
      </div> : null}
    </div>);


    if (item.children && item.children.type === "event") {
      return <event-expandable-renderer event={item.children.event}>
        {innerContent}
      </event-expandable-renderer>
    }

    else {
      let ItemRenderer = this.historyType === "query" ? "query-page-link" : "stencil-route-link";
      let ItemWrapperTag = item.type === "abstract" ? "expandable-renderer" : ItemRenderer;
      let firstMenuChild = item.children ? item.children.items[0] : "";
      return (
        <ItemWrapperTag firstMenuChild={firstMenuChild} url={href} activeClass="active" exact={false}
                        somethingChanged={this.value}>
          {innerContent}
        </ItemWrapperTag>
      )
    }

  }

  render() {
    return (this.renderMenuItem(this.value))
  }

}
