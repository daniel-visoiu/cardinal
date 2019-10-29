import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-card",
	styleUrl: './page.css'
})

export class PskCard {

	@Prop() title: string = "";
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
