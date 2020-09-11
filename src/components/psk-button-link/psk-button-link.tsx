import { Component, Prop, h } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { BindModel } from "../../decorators/BindModel";

@Component({
  tag: "psk-button-link"
})

export class PskButtonLink {
  @CustomTheme()

  @BindModel() modelHandler;

  @Prop() page: string;

  @Prop() name?: string;

  @Prop() icon?: string;

  render() {
    return (
      <psk-link page={this.page} class={'button-link'}>
        {this.icon ? <psk-icon icon={this.icon}/> : null}
        {this.name ? <div>{this.name}</div> : <slot/>}
      </psk-link>
    )
  }
}
