import { Component, h, Prop } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-img"
})

export class PskImg {
	@CustomTheme()

	@TableOfContentProperty({
		description: `This property is the path to the image source (Example:"page/PrivateSky/EDFS.png").`,
		isMandatory: true,
		propertyType: `string`
	})
	@Prop() src: string;

	@TableOfContentProperty({
		description: `This property is the title of the image(the alt attribute) and the description of the image.`,
		isMandatory: false,
		propertyType: `string`,
		specialNote: `If no title is given,there will not be assumed one and there will be no image description/alt.`
	})
	@Prop() title: string;

	render() {
		return (
			<div class="image_container">
				<div class="image_wrapper">
					<img src={this.src} class="img-fluid" alt={this.title} />
				</div>
				{this.title ? <div class="image_description">{this.title}</div> : null}
			</div>
		);
	}
}
