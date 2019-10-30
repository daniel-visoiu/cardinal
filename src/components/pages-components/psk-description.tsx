import { Component, h, Prop } from "@stencil/core";

@Component({
	tag: "psk-description"
})

export class PskDescription {

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
