import { Component, h, Prop, Element, State } from "@stencil/core";
import ControllerFactory from "../../services/ControllerFactory";

@Component({
	tag: "psk-container",
	shadow: true
})
export class PskContainer {
	@Prop() controllerName?: any | null;
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