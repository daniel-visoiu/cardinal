import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-card",
	styleUrl: "./page.css"
})

export class PskCard {

	@Prop() title: string = "";

	render() {

    return (
      <div class="card psk-card">
        {this.title ?
          <div class="card-header">
            {this.title}
          </div> : null}

				<div class="card-body">
					<slot />
				</div>
			</div>
		)
	}


}
