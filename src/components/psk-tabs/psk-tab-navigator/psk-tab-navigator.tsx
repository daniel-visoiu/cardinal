import { Component, Element, State, Prop, h } from "@stencil/core";

import CustomTheme from "../../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-tab-navigator',
  shadow: true
})

export class PskTabNavigator {
  @CustomTheme()

  @TableOfContentProperty({
    description: [
      `This property actives the tab with specified index.`,
      `The first tab is indexed with 0. If an invalid index is set, there will be no active tab.`,
      `By default there first tab is selected.`
    ],
    isMandatory: false,
    propertyType: `number`,
    defaultValue: `0`
  })
  @Prop({ reflect: true }) default: number = 0;

  @State() tabNavigator;

  @Element() private _host: HTMLElement;

  tabsData = [];

  selectTab(e) {
    const button = e.currentTarget;
    const tabs = this._host.children;
    const selected = parseInt(button.getAttribute('data-index'));

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('hidden', '');
    }
    tabs[selected].removeAttribute('hidden');
    this.tabNavigator = this.getNavigator(selected);
  }

  componentWillLoad() {
    const tabs = this._host.children;

    for (let i = 0; i < tabs.length; i++) {
      this.tabsData = [
        ...this.tabsData,
        {
          id: i,
          title: tabs[i].getAttribute('title')
        }
      ];
    }
  }

  componentDidLoad() {
    if (typeof this.default !== 'number') return;
    if (this.default < 0 || this.default > this._host.children.length) return;

    const tabs = this._host.children;
    this.tabNavigator = this.getNavigator(this.default);
    tabs[this.default].removeAttribute('hidden');
  }

  getNavigator(selected) {
    return (
      <div class='tab-navigator'>
      {
        this.tabsData.map(tab =>
          <psk-button
            class={tab.id === selected ? 'active' : ''}
            data-index={tab.id}
            onClick={e => this.selectTab(e)}>{tab.title}
          </psk-button>
        )
      }
      </div>
    )
  }

  render() {
    return [
      this.tabNavigator,
      <div class='tab-container'>
        <slot />
      </div>
    ]
  }
}
