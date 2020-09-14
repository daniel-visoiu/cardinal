import { Component, Prop, Host, h } from "@stencil/core";

import CustomTheme from "../../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../../decorators/TableOfContentProperty";

@Component({
  tag: 'psk-tab',
  shadow: true
})

export class PskTab {
  @CustomTheme()

  @TableOfContentProperty({
    description: `This property is used as the tab title`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() title: string;

  render() {
    return (
      <Host hidden>
        <slot />
      </Host>
    )
  }
}
