import { Component, Element, Prop, State, Listen, h } from "@stencil/core";

import CustomTheme from "../../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-tab-navigator',
  styleUrls: {
    default: './styles/psk-tab-navigator.default.css',
    layout: './styles/psk-tab-navigator.layout.css'
  },
  shadow: true
})

export class PskTabNavigator {
  private tabData = [];

  @CustomTheme()

  @Element() private _host: HTMLElement;

  @State() tabNavigator: HTMLElement = null;

  @TableOfContentProperty({
    description: [
      `This property actives the tab with specified index.`,
      `By default the first tab is selected.`,
      `The first tab is indexed with 0. If an invalid index is set, a warning will be thrown and the default value will be selected.`
    ],
    isMandatory: false,
    propertyType: `number`,
    defaultValue: `0`
  })
  @Prop({ mutable: true, reflect: true }) default: number = 0;

  @TableOfContentProperty({
    description: [
      `There are four alternatives for this attribute: "horizontal", "vertical", "mobile" and "none" (or any string).`,
      `According to this property, the appearance of the tabs is changing. Also, the tab control mechanism may be different.`
    ],
    isMandatory: false,
    propertyType: `string`,
    defaultValue: `horizontal`
  })
  @Prop({ reflect: true }) layout = 'horizontal'

  componentWillLoad() {
    const tabs = this._host.children;
    for (let i = 0; i < tabs.length; i++) {
      this.tabData.push({
        index: i,
        title: tabs[i].getAttribute('title')
      });
    }
    this.default = this.__checkDefault();
    this.tabNavigator = this.__renderTabNavigator(this.default);
  }

  componentDidLoad() {
    this.__renderActiveTab(this.default);
  }

  @Listen('psk-tab-navigator:psk-select:change')
  onTabSelected(e) {
    e.stopImmediatePropagation();
    const { value } = e.data;
    const selected = parseInt(value);
    this.__selectTab(selected);
  }

  onTabClicked(e) {
    e.stopImmediatePropagation();
    const button = e.currentTarget;
    const buttons = [].slice.call(button.parentElement.children);
    const selected = buttons.indexOf(button);
    this.__selectTab(selected);
  }

  __checkDefault() {
    if (!Number.isInteger(this.default)) {
      console.warn('psk-tab-navigator:', `"default" value is not an integer`);
      return 0;
    }
    if (this.default < 0 || this.default >= this._host.children.length) {
      console.warn('psk-tab-navigator:', `"default" value is not in corresponding range [0, ${this._host.children.length - 1}]`);
      return 0;
    }
    return this.default;
  }

  __selectTab(selected) {
    this.tabNavigator = this.__renderTabNavigator(selected);
    this.__renderActiveTab(selected);
  }

  __renderActiveTab(selected) {
    const tabs = this._host.children;
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('hidden', 'true');
      tabs[i].removeAttribute('slot');
    }
    tabs[selected].removeAttribute('hidden');
    tabs[selected].setAttribute('slot', 'tab-active');
  }

  __renderTabNavigator(selected) {
    if (this.layout === 'mobile') {
      const options = this.tabData.map(tab => `${tab.title}, ${tab.index}`).join(' | ');
      return (
        <psk-form-row>
          <psk-select
            value={selected}
            select-options={options}
            event-name='psk-tab-navigator:psk-select:change'
          />
        </psk-form-row>
      )
    }

    return this.tabData.map(tab =>
      <psk-button
        class={{'active': tab.index === selected}}
        onClick={e => this.onTabClicked(e)}>{tab.title}
      </psk-button>
    )
  }

  render() {
    return (
      <div class='tabs'>
        <div class='tab-navigator'>{this.tabNavigator}</div>
        <div class='tab-container'>
          <slot name='tab-active' />
        </div>
      </div>
    )
  }
}
