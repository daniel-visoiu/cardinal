import {Component, h, Listen, Prop, State} from "@stencil/core";

@Component({
  tag: "psk-page",
  styleUrl: "./page.css",
  shadow:true
})

export class PskPage {

  @Prop() title: string;
  @State() chaptersToc :any;
  @Listen("psk-send-chapter")
  receivedChapter(event: any) {
    this.chaptersToc = event.detail;
    console.log(this.chaptersToc);
  }

  render() {

    return (
      <div>
        <h1>{this.title}</h1>
        <slot/>
      </div>
    )
  }
}
