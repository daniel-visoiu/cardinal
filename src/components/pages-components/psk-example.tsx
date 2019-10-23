import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "psk-example",
  styleUrl: "./page.css"
})

export class PskExample {

  @Prop() exampleTitle?: string = "Live example";

  render() {

    return (
      <psk-card title={this.exampleTitle}>
        <slot />
      </psk-card>
    );
  }

}
