import { Component, h, Prop } from '@stencil/core';
import { TableOfContentClass, TableOfContentProperty } from '../../decorators/TableOfContent';

@Component({
	tag: 'psk-page-not-found',
	styleUrl: './psk-page-not-found.css',
	shadow: true
})
export class PskPageNotFound {

	@TableOfContentClass({
		className: "PskPageNotFound",
		componentTag: "psk-page-not-found",
		description: "This is the component that is used for redirecting an so on..."
	})

	@TableOfContentProperty({
		description: "Shalala, this is property decorator"
	})
	@Prop() basePath?: string;
	@Prop() urlDestination?: string = null;
	@Prop() pageRenderer?: string = "psk-page-not-found-renderer";

	componentWillLoad() {
		console.log('Checking for ToC decorators');
	}

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
