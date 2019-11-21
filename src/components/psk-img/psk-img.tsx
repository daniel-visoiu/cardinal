import { Component, h, Prop, State } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

const defaultBasePath = "https://raw.githubusercontent.com/PrivateSky/pwc-apps/master/pages/";

@Component({
	tag: "psk-img"
})

export class PskImg {
	@CustomTheme()

	@TableOfContentProperty({
		description: `This property is the path to the image source (Example:"PrivateSky/EDFS.png").`,
		isMandatory: false,
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

	@State() basePath: string;

	constructor() {
		if (this.src.indexOf('http') !== -1) {
			this.basePath = this.src;
			return;
		}

		// @ts-ignore
		if (typeof globalConfig !== "undefined" && typeof globalConfig.pagesBasePath === "string") {
			// @ts-ignore
			this.basePath = globalConfig.pagesBasePath + this.src;
		} else {
			this.basePath = defaultBasePath + this.src;
		}
	}

	render() {
		return (
			<div class="image_container">
				<div class="image_wrapper">
					<img src={this.basePath} class="img-fluid" alt={this.title} />
				</div>
				{this.title ? <div class="image_description">{this.title}</div> : null}
			</div>
		);
	}
}
