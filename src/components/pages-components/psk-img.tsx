import {Component, h, Prop} from "@stencil/core";

const basePath = "https://raw.githubusercontent.com/PrivateSky/pwc-apps/master/src/pages/";

@Component({
  tag: "psk-img",
  shadow: false
})

export class PskImg {

  @Prop() src: string;
  @Prop() title: string;

  render() {
    return (<div class="image_container">
        <div class="image_wrapper">
          <img src={basePath + this.src} class="img-fluid" alt={this.title}/>
        </div>
        {this.title ? <div class="image_description">{this.title}</div> : null}
      </div>
    )
  }

}
