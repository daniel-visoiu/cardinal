import { Component, Prop, Host, h } from "@stencil/core";

import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-details',
  styleUrls: {
    default: './styles/psk-details.default.css',
    layout: './styles/psk-details.layout.css'
  },
  shadow: true
})

export class PskDetails {
  @CustomTheme()

  @TableOfContentProperty({
    description: `This property is used as title or summary for collapsable section.`,
    isMandatory: false,
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

  @TableOfContentProperty({
    description: [
      `There are three alternatives for this attribute: "collapsable", "plus" and "default". If other value is passed, fallback plan is also the default value.`,
      `According to this property, the appearance of the component is changing.`
    ],
    isMandatory: false,
    propertyType: `string`,
    defaultValue: `default`
  })
  @Prop({ reflect: true, mutable: true }) layout: string = 'default';

  toggleDetails(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.opened = !this.opened;
  }

  __renderDetails() {
    switch (this.layout) {
      case 'collapsable':
      {
        let result = [];
        if (this.title) result.push(
          <div class='title' tabindex={0} onClick={e => this.toggleDetails(e)}>
            <span>{this.title}</span>
          </div>
        )
        result.push(
          <div class='content'>
            <slot/>
          </div>,
          <div class='footer' tabindex={0} onClick={e => this.toggleDetails(e)}>
            <slot name='footer'/>
            <div>
              <psk-icon icon='chevron-down' class={{'rotated': this.opened}}/>
            </div>
          </div>
        )
        return result;
      }
      case 'plus':
        return [
          <div class='content'>
            <slot/>
          </div>,
          <div class='footer' tabindex={0} onClick={e => this.toggleDetails(e)}>
            <psk-icon icon={this.opened ? 'minus' : 'plus'} />
            <span>{this.title}</span>
          </div>
        ]
      default:
        this.layout = 'default';
        return [
          <div class='title' tabindex={0} onClick={e => this.toggleDetails(e)}>
            <psk-icon icon='chevron-right' class={{'rotated': this.opened}}/>
            <span>{this.title}</span>
          </div>,
          <div class='content'>
            <slot/>
          </div>
        ];
    }
  }

  render() {
    return <Host opened={this.opened}>{this.__renderDetails()}</Host>
  }
}
