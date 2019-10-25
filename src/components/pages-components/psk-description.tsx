import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-description"
})

export class PskDescription {

	@Prop() title: string = "";

	render() {
		return (
			<psk-chapter title={this.title}>
				<div class="psk-description">
					<slot />
				</div>
			</psk-chapter>
		)
	}
}
