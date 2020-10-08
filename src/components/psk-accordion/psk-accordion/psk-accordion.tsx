import { Component, Prop, Element, Host, h } from '@stencil/core';

import CustomTheme from "../../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-accordion',
  styleUrls: {
    default: './styles/psk-accordion.default.css',
    layout: './styles/psk-accordion.layout.css'
  },
  shadow: true,
})

export class PskAccordion {
  @CustomTheme()

  @Element() private __host: HTMLElement;

  @TableOfContentProperty({
    description: `This property decides if you can toggle more then one item of the accordion.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop() multiple: boolean = false;

  @TableOfContentProperty({
    description: [
      `There is one alternative for this attribute: "default". If other value is passed, fallback plan is also the default value.`,
      `According to this property, the appearance of the component items are changing.`,
      `Future layouts will be developed soon.`
    ],
    isMandatory: false,
    propertyType: `string`,
    defaultValue: `default`
  })
  @Prop({ reflect: true, mutable: true }) layout: string = 'default';

  componentWillLoad() {
    this.layout = this.__getAccordionItemLayout();
    const items = this.__host.children;

    for (let i = 0; i < items.length; i++) {
      items[i].setAttribute('layout', this.layout);
      items[i].addEventListener('psk-accordion-item:toggle', e => this.__toggleAccordionItem(e, i))
    }
  }

  __getAccordionItemLayout() {
    switch (this.layout) {
      default:
        return 'default'
    }
  }

  __getAccordionItemStatus(item) {
    if (!item.hasAttribute('opened')) return false;
    const opened = item.getAttribute('opened');
    return ['opened', 'true', ''].includes(opened);
  }

  __toggleAccordionItem(e, index) {
    e.stopImmediatePropagation();

    const items = this.__host.children;
    if (this.multiple === false) {
      for (let i = 0; i < items.length; i++) {
        if (i === index) continue;
        items[i].removeAttribute('opened');
      }
    }

    const item = items[index];
    if (this.__getAccordionItemStatus(item)) {
      item.removeAttribute('opened');
    } else {
      item.setAttribute('opened', 'opened');
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
