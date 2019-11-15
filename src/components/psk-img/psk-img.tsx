import {Component, h, Prop, State} from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

const defaultBasePath = "https://raw.githubusercontent.com/PrivateSky/pwc-apps/master/pages/";

@Component({
  tag: "psk-img"
})

export class PskImg {
  @CustomTheme()

  @TableOfContentProperty({
    description:`This property is the source of the image(<name>.<extension>).`,
    isMandatory:false,
    propertyType:`string`
  })
  @Prop() src: string;

  @TableOfContentProperty({
    description:`This property is the title of the image(the alt attribute) and the description of the image.`,
    isMandatory:false,
    propertyType:`string`
  })
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
    console.log(this.basePath)
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
