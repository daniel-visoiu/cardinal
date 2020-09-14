import { Component, Prop, Host, h } from "@stencil/core";

import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-details',
  shadow: true
})

export class PskDetails {
  @CustomTheme()

  @TableOfContentProperty({
    description: `This property is used as title / summary.`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() summary: string = '';

  @TableOfContentProperty({
    description: `This property decides if the content of the component is visible / hidden.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: `false`
  })
  @Prop() opened: boolean = false;

  detailToggle(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.opened = !this.opened;
  }

  render() {
    return (
      <Host opened={this.opened}>
        <div class='summary' tabindex={0} onClick={e => this.detailToggle(e)}>
          <psk-icon icon={this.opened ? 'chevron-down' : 'chevron-right'} />
          <span>{this.summary}</span>
        </div>
        <div class='content' hidden={!this.opened}>
          <slot />
        </div>
      </Host>
    )
  }
}
