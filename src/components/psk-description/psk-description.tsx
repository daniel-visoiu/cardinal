import { Component, h, Prop } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-description"
})

export class PskDescription {

	@TableOfContentProperty({
		description: `This property is the title of the new psk-card/psk-chapter that will be created.`,
		isMandatory: false,
		propertyType: `string`,
		specialNote: `All the empty spaces in the title will be deleted.`
	})
	@Prop() title: string = "";

	render() {
		const descriptionBody = (
			<div class="psk-description">
				<slot />
			</div>
		);

		if (this.title.replace(/\s/g, '') === '') {
			return (
				<psk-card>{descriptionBody}</psk-card>
			);
		}

		return (
			<psk-chapter title={this.title}>
				{descriptionBody}
			</psk-chapter>
		)
	}
}
