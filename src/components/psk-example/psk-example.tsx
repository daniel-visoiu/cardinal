import { Component, h, Prop } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-example"
})

export class PskExample {
	@TableOfContentProperty({
		description:`The title of the component's example that will be used to create a psk-chapter.`,
		isMandatory:false,
		propertyType:`string`
	})
	@Prop() title: string = "";

	render() {
		return (
			<psk-chapter title={this.title}>
				<slot />
			</psk-chapter>
		);
	}
}