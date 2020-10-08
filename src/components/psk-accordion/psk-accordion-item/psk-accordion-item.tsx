import {Component, Prop, Host, h, Element} from "@stencil/core";

import CustomTheme from "../../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-accordion-item',
  styleUrls: {
    default: './styles/psk-accordion-item.default.css',
    layout: './styles/psk-accordion-item.layout.css'
  },
  shadow: true
})

export class PskAccordionItem {
  @CustomTheme()

  @Element() private __host: HTMLElement;

  @TableOfContentProperty({
    description: `This property is used as title or summary for collapsable section.`,
    isMandatory: true,
    propertyType: `string`
  })
  @Prop() title: string = '';

  @TableOfContentProperty({
    description: `This property decides if the content of the component is visible / hidden.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop() opened: boolean = false;

  @Prop({ reflect: true, mutable: true }) layout: string = 'default';

  toggleAccordionItem(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.__host.dispatchEvent(new Event('psk-accordion-item:toggle'));
  }

  render() {
    return <Host opened={this.opened}>
      <div class='title' tabindex={0} onClick={e => this.toggleAccordionItem(e)}>
        <psk-icon icon='chevron-right' class={{'rotated': this.opened}}/>
        <span>{this.title}</span>
      </div>
      <div class='content'>
        <slot/>
      </div>
    </Host>
  }
}
