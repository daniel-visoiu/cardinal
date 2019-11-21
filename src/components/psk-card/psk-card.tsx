import { Component, h, Prop } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-card"
})
export class PskCard {
	@CustomTheme()

	@TableOfContentProperty({
		description: `This property is the title that will be rendered in title specific format.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() title: string = "";

	@TableOfContentProperty({
		description: `This property is the id which will be attached to the component so finding the component in the DOM should be simplified.
					The id is also simplifying the navigation to that section of the page where the component is rendered.
					Special characters(Example : ':','/') will be replaced with dash('-').`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() id: string = "";

	render() {

		const elementId = this.id.trim().replace(/(\s+|:+|\/+)/g, "-").toLowerCase();
		let cardHeader = null;
		if (this.title) {
			cardHeader = (
				<div class="card-header">
					<h5>
						{this.title}
						{elementId.length > 0 ? <psk-copy-clipboard id={elementId}>#</psk-copy-clipboard> : null}
					</h5>
					<slot name="toolbar" />
				</div>
			);
		}

		return (
			<div class="card psk-card" id={elementId}>
				{cardHeader}
				<div class="card-body">
					<slot />
				</div>
			</div>
		)
	}
}