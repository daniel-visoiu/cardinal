import { Component, h, Prop, Element, State } from "@stencil/core";
import ControllerFactory from "../../services/ControllerFactory";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
	tag: "psk-container"
})
export class PskContainer {
	@TableOfContentProperty({
		isMandatory: false,
		description: [`This property is a string that will permit the developer to choose his own controller.`,
			`If no value is sent then the null default value will be taken and the component will use the basic Controller.`],
		propertyType: `string`,
		defaultValue: `null`
	})
	@Prop() controllerName?: string | null;

	@TableOfContentProperty({
		description: [`This property is the page url (html) that will be passed to the psk-page-loader component`,
			`This component will sent a get request to that url in order to get the content of that url.`],
		isMandatory: false,
		propertyType: `string`,
		defaultValue: `null`
	})
	@Prop() htmlFilePath?: string | null;

	@State() controller: any | null;
	@State() innerHtml: string | null;
	@State() controllerScript: string | null;

	@Element() host: HTMLElement;

	constructor() {
		const controllerNameForInstance = this.controllerName ? this.controllerName : 'Controller';

		ControllerFactory.getController(controllerNameForInstance).then((CTRL) => {
			this.controller = new CTRL(this.host);
		});
	}

	render() {
		return [
			<slot />,
			this.htmlFilePath && <psk-page-loader pageUrl={this.htmlFilePath} />,
			this.controllerScript && this.controller.executeScript(this.controller, this.controllerScript)
		];
	}

	componentDidLoad() {
		const scriptInnerHtml: HTMLElement = this.host.querySelector("psk-controller");
		if (scriptInnerHtml !== null) {
			this.controllerScript = scriptInnerHtml.innerHTML;
			scriptInnerHtml.innerHTML = "";
		}
	}
}