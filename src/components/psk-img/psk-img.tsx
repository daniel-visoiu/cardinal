import { Component, h, Prop } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import {BindModel} from "../../decorators/BindModel";

@Component({
	tag: "psk-img"
})

export class PskImg {
	@CustomTheme()
  @BindModel() modelHandler;
	@TableOfContentProperty({
		description: `This property is the path to the image source (Example:"page/PrivateSky/EDFS.png").`,
		isMandatory: true,
		propertyType: `string`
	})
	@Prop() src: string;

  @TableOfContentProperty({
    description: `This property is setting the width of the image. The value should be an integer specifying the units in pixels`,
    isMandatory: false,
    propertyType: `string`,
  })
  @Prop() width: string;

  @TableOfContentProperty({
    description: `This property is setting the height of the image. The value should be an integer specifying the units in pixels`,
    isMandatory: false,
    propertyType: `string`,
  })
  @Prop() height: string;

	@TableOfContentProperty({
		description: `This property is the title of the image(the alt attribute) and the description of the image.`,
		isMandatory: false,
		propertyType: `string`,
		specialNote: `If no title is given,there will not be assumed one and there will be no image description/alt.`
	})
	@Prop() title: string;

	render() {
    let imgTagAttributes = {
      src: this.src,
      alt: this.title
    };
    if (this.height) {
      imgTagAttributes['height'] = this.height;
    }
    if (this.width) {
      imgTagAttributes['width'] = this.width;
    }

		return (
			<div class="image_container">
				<div class="image_wrapper">
					<img {...imgTagAttributes}  />
				</div>
				{this.title ? <div class="image_description">{this.title}</div> : null}
			</div>
		);
	}
}
