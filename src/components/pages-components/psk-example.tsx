import {Component, h} from "@stencil/core";

@Component({
  tag: "psk-example",
  styleUrl: "./page.css"
})

export class PskExample {

  render() {

    return (
      <psk-card title="Live example">
        <slot/>
      </psk-card>)
  }

}
