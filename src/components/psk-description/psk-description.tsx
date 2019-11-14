import { Component, h, Prop } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-description"
})

export class PskDescription {

	@TableOfContentProperty({
		description:`The title of the component's description that will be used in order to create a psk-chapter.`,
		isMandatory: false,
		propertyType:`string`
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
