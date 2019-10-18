import {Component, h, Prop} from "@stencil/core";
const basePath = "https://raw.githubusercontent.com/PrivateSky/pwc-apps/master/src/pages/";

@Component({
  tag: "psk-img",
  styleUrl: "./page.css"
})

export class PskImg {

  @Prop() src:string;

  render() {
    return (
      <img src={basePath+this.src} class="img-fluid" alt="Responsive image"/>
     )
  }

}
