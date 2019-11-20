import { Component, h, Prop } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-card"
})

export class PskCard {
	@CustomTheme()

	@TableOfContentProperty({
		description: `This property is the title of our own version of the html card.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() title: string = "";

	@TableOfContentProperty({
		description: `This property is the id which will be used in order to create the unique element id and for the psk-copy-clipboard component.`,
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
