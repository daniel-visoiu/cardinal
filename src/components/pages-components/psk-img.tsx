import {Component, h, Prop, State} from "@stencil/core";

const defaultBasePath = "https://raw.githubusercontent.com/PrivateSky/pwc-apps/master/pages/";

@Component({
  tag: "psk-img",
  styleUrl: './page.css'
})

export class PskImg {

  @Prop() src: string;
  @Prop() title: string;
  @State() basePath: string;

  constructor() {
    // @ts-ignore
    if (typeof globalConfig !== "undefined" && typeof globalConfig.pagesBasePath === "string") {
      // @ts-ignore
      this.basePath = globalConfig.pagesBasePath;
    } else {
      this.basePath = defaultBasePath;
    }
  }

  render() {
    return (
      <div class="image_container">
        <div class="image_wrapper">
          <img src={this.basePath + this.src} class="img-fluid" alt={this.title}/>
        </div>
        {this.title ? <div class="image_description">{this.title}</div> : null}
      </div>
    );
  }
}
