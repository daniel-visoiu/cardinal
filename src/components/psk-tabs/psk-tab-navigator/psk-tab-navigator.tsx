import { Component, Element, State, Prop, Host, h } from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
  tag: 'psk-tab-navigator',
  shadow: true
})

export class PskTabNavigator {

  @CustomTheme()

  @Element() host: HTMLElement;

  @State() tabNavigator;

  @Prop() default: number | null = null;

  tabsData = [];

  componentWillLoad() {
    const tabs = this.host.children;

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

  selectTab(e) {
    const button = e.currentTarget;
    const tabs = this.host.children;
    const selected = button.getAttribute('data-index');

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('hidden', '');
    }
    tabs[selected].removeAttribute('hidden');
    this.tabNavigator = this.getNavigator(selected);
  }

  componentDidLoad() {
    if (this.default) {
      const tabs = this.host.children;
      this.tabNavigator = this.getNavigator(`${this.default}`);
      tabs[this.default].removeAttribute('hidden');
    }
  }

  getNavigator(selected) {
    return (
      <div class={'tab-navigator'}>
      { this.tabsData.map(tab => {
          // console.log(`${tab.id}`, selected);
          return (
            <psk-button
              class={`${tab.id}` === selected ? 'active' : ''}
              data-index={tab.id}
              onClick={(e) => this.selectTab(e)}>{tab.title}
            </psk-button>
          )
        })
      }
      </div>
    )
  }

  render() {
    return (
      <Host>
        {this.tabNavigator}
        <div class={'tab-container'}>
          <slot />
        </div>
      </Host>
    )
  }
}
