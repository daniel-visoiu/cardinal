import { Component, h } from "@stencil/core";

@Component({
	tag: "psk-description",
	styleUrl: "./page.css"
})

export class PskDescription {

	render() {

		return (
			<div class="psk-description">
				<slot />
			</div>
		)
	}


}
