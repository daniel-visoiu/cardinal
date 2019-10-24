import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-card",
	styleUrl: './page.css'
})

export class PskCard {

	@Prop() title: string = "";
	@Prop() elementId: string = "";

	render() {

		return (
			<div class="card psk-card" id={this.elementId.replace(/ /g, "_").toLowerCase()}>
				{this.title ?
					<div class="card-header">
						<h5>{this.title}</h5>
					</div> : null}

				<div class="card-body">
					<slot />
				</div>
			</div>
		)
	}


}
