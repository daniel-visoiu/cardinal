import {Component, h, Prop} from "@stencil/core";

@Component({
  tag: "psk-page",
  styleUrl: "./page.css"
})

export class PskPage {

  @Prop() title: string;

  render() {

    return (
      <div>
        <h1>{this.title}</h1>
        <slot/>
      </div>
    )
  }
}
