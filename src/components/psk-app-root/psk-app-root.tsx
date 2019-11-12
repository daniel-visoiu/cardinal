import { Component, h, Prop, EventEmitter, Event, State, Element } from '@stencil/core';
import { RouterHistory } from "@stencil/router/dist/types/global/interfaces";
import ControllerFactory from "../../services/ControllerFactory";
import { injectHistory } from '@stencil/router';

@Component({
	tag: 'psk-app-root',
	shadow: true
})
export class PskAppRoot {
	@Prop() controller: any;
	@Prop() history: RouterHistory;

	@State() mobileLayout: boolean = false;
	@State() componentCode: string = "";
	@State() hasSlot: boolean = false;

	@Element() host: HTMLDivElement;

	@Event({
		eventName: 'routeChanged',
		composed: true,
		cancelable: true,
		bubbles: true,
	}) routeChangedEvent: EventEmitter;

	@Event({
		eventName: "controllerFactoryIsReady",
		composed: true,
		cancelable: true
	}) cfReadyEvent: EventEmitter;

	constructor() {
		if (this.controller) {
			let controllerName = this.controller;
			ControllerFactory.getController(controllerName).then((controller) => {
				new controller(this.host);
			});
		} else {
			console.log("No controller added to app-root");
		}
	}

	componentWillLoad() {
		this.cfReadyEvent.emit(ControllerFactory);
		let innerHTML = this.host.innerHTML;
		innerHTML = innerHTML.replace(/\s/g, "");
		if (innerHTML.length) {
			this.hasSlot = true;
		}
	}

	render() {
		let DefaultRendererTag = "psk-default-renderer";
		return (
			this.hasSlot ? <slot /> : <DefaultRendererTag />
		);
	}
}
injectHistory(PskAppRoot);