import { Component, h, Prop } from '@stencil/core';

@Component({
	tag: 'psk-page-not-found',
	styleUrl: './psk-page-not-found.css',
	shadow: true
})
export class PskPageNotFound {

	@Prop() basePath?: string;
	@Prop() urlDestination?: string = null;
	@Prop() pageRenderer?: string = "psk-page-not-found-renderer";

	render() {

		if (this.urlDestination !== null) {
			return <stencil-router-redirect url={this.urlDestination} />;
		} else {
			let currentLocation = window.location.pathname;
			let shouldBeRedirected = currentLocation.indexOf(this.basePath) != -1;

			if (shouldBeRedirected) {
				return <stencil-router-redirect url={this.basePath} />;
			} else {
				return <this.pageRenderer />
			}
		}
	}
}
