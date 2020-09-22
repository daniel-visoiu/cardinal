import {Component, Event, EventEmitter, h, Prop} from '@stencil/core';
import {MenuItem} from "../../interfaces/MenuItem";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import {ExtendedHistoryType} from "../../interfaces/ExtendedHistoryType";

@Component({
  tag: 'psk-menu-item-renderer',
  styleUrl:"../../assets/fonts/font-awesome/font-awesome.min.css",
  shadow: true
})

export class PskMenuItemRenderer {
  @CustomTheme()
  @TableOfContentProperty({
    description: `This property is the MenuItem that will be renderer as part of the menu`,
    isMandatory: false,
    propertyType: `MenuItem`
  })
  @Prop() value: MenuItem;

  @TableOfContentProperty({
    description:`This property is used in the css file for renderes in order to verify the state of the component`,
    isMandatory: false,
    propertyType: `boolean`
  })
  @Prop({
    reflect: true,
  }) active: boolean;
  @Prop() historyType: ExtendedHistoryType;

  @Event({
    eventName: 'menuClicked',
    composed: true,
    cancelable: true,
  }) menuClicked: EventEmitter;

  notifyItemClicked = function (evt) {
    this.menuClicked.emit(evt.target);
  };

  renderMenuItem(item) {
    let href = item.path;
    let children = [];
    if (item.children && item.children.type === "known") {
      item.children.items.forEach((child) => {
        children.push(this.renderMenuItem(child));
      })
    }
    let ItemRenderer = this.historyType === "query" ? "query-page-link" : "stencil-route-link";
    let ItemWrapperTag = item.type === "abstract" ? "dropdown-renderer" : ItemRenderer;
    return (
      <ItemWrapperTag url={href} activeClass="active" exact={false} somethingChanged={this.value} onClick={(evt)=>this.notifyItemClicked(evt)}>
        <div class="wrapper_container">
          <div class={`item_container ${item.children?"has-children":""}`}>
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
