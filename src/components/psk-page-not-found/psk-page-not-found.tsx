import { Component, h, Prop } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentClass } from '../../decorators/TableOfContentClass';

@Component({
	tag: 'psk-page-not-found',
	styleUrl: './psk-page-not-found.css',
	shadow: true
})
export class PskPageNotFound {

	@TableOfContentProperty({
		description: `This property is the base path of the website. 
		If this parameter is sent to the component, then when the user navigates to an unknown page, he will be redirected to the base path. 
		It is not mandatory to be the root of the application, it can be the root of a section inside the website.`,
		specialNote: `If this parameter is missing, urlDestination parameter is checked.`,
		mandatory: false
	})
	@Prop() basePath?: string;

	@TableOfContentProperty({
		description: `This property gives a custom redirect URL destination in case the user navigates to an unknown page.`,
		specialNote: `If this parameter is missing, pageRenderer parameter is checked.`,
		mandatory: false
	})
	@Prop() urlDestination?: string = null;

	@TableOfContentProperty({
		description: `This property allows the component to display a custom Page 
		not found content in case the user navigates to an unknown page.`,
		specialNote: `If this parameter is missing, <b>psk-page-not-found-renderer</b> is assumed.`,
		mandatory: false
	})
	@Prop() pageRenderer?: string = "psk-page-not-found-renderer";

	render() {
		if (this.urlDestination !== null) {
			return (
				<stencil-router-redirect url={this.urlDestination} />
			);
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

	@TableOfContentClass({
		className: "PskPageNotFound",
		componentTag: "psk-page-not-found",
		description: [
			`This component is intended to be used inside a router component, so when the user navigates to an unknown route, this component will be loaded.`,
			`This component should be instantiated everywhere in application where there is a possibility to navigate to a wrong or unknown route.`,
			`The component has the role to redirect the user to a valid route inside the application by using basePath or urlDestination properties.`,
			`If none of these two properties are given, then a third property is checked: pageRenderer.`,
			`The the order of the properties priority is the following: basePath; urlDestination - if basePath is not given, this property will be used; pageRenderer - if urlDestination is not given, pageRenderer will be used`
		]
	})
	// @ts-ignore
	private helpConfiguration: any;
}
