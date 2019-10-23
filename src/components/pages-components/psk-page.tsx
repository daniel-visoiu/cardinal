import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-page",
	styleUrl: "./page.css",
	shadow: true
})

export class PskPage {

	@Prop() title: string = "";

	render() {
		return (
			<div>
				<nav><h3>{this.title}</h3></nav>
				<div class="page-content">
					<slot />
				</div>
			</div>
		)
	}
}
