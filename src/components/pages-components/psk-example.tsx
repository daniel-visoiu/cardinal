import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-example"
})

export class PskExample {

	@Prop() title: string = "Live example";

	render() {
		return (
			<psk-chapter title={this.title}>
				<slot />
			</psk-chapter>
		);
	}
}