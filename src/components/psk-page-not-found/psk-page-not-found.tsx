import { Component, h, Prop } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
	tag: 'psk-page-not-found',
	shadow: true
})
export class PskPageNotFound {
	@CustomTheme()
	@TableOfContentProperty({
		description: `This property is the base path of the website. 
		If this parameter is sent to the component, then when the user navigates to an unknown page, he will be redirected to the base path. 
		It is not mandatory to be the root of the application, it can be the root of a section inside the website.`,
		specialNote: `If this parameter is missing, urlDestination parameter is checked.`,
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() basePath?: string;

	@TableOfContentProperty({
		description: `This property gives a custom redirect URL destination in case the user navigates to an unknown page.`,
		specialNote: `If this parameter is missing, pageRenderer parameter is checked.`,
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() urlDestination?: string = null;

	@TableOfContentProperty({
		description: `This property allows the component to display a custom Page 
		not found content in case the user navigates to an unknown page.`,
		specialNote: `If this parameter is missing, psk-page-not-found-renderer is assumed.`,
		isMandatory: false,
		propertyType: 'string',
		defaultValue: 'psk-page-not-found-renderer'
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
}
