import { Component, h, Prop, Element, State } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from "../../events/PskButtonEvent";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { BindModel } from '../../decorators/BindModel';

const ACCEPTED_DEFAULT_DISPATCHERS = [document, window];

@Component({
	tag: 'psk-switch-button',
	shadow: true
})
export class PskSwitchButton {

	@BindModel()

	@CustomTheme()

	@Element() htmlElement: HTMLElement;
	@State() closed: boolean = true;
	@Prop() active: string | null;
	@Prop() inactive: string | null;

	@TableOfContentProperty({
		description: ['This attribute is telling the component where to trigger the event. Accepted values: "document, "window".',
			'If the value is not set or it is not one of the accepted values, the eventDispatcher will be the component itself.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() eventDispatcher: string | null;

	@TableOfContentProperty({
		description: ['By defining this attribute, the component will be able to trigger an event. The name of the event is the value of the attribute.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() toggleEvent: string | null;

	@Prop() title: string | null;

	render() {
		return (
			(this.closed == true) ?
				<div class="status-container" onClick={(evt: MouseEvent) => {
					this.closed = !this.closed;
					if (this.toggleEvent) {
						evt.preventDefault();
						evt.stopImmediatePropagation();

						let pskButtonEvent = new PskButtonEvent(this.toggleEvent, this.closed, {
							bubbles: true,
							composed: true,
							cancelable: true
						});

						let eventDispatcherElement = this.htmlElement;
						if (this.eventDispatcher) {
							if (ACCEPTED_DEFAULT_DISPATCHERS.indexOf(window[this.eventDispatcher]) !== -1) {
								eventDispatcherElement = window[this.eventDispatcher];
							}
						}
						eventDispatcherElement.dispatchEvent(pskButtonEvent);
					}
				}}>
					<h5>{this.title}</h5>
					<psk-grid class="two-options-container"
						columns={2}
						layout="xs=[6,6] s=[6,6] m=[6,6] l=[6,6]">
						<div class="right-container white-background">
							<p>{this.active}</p>
						</div>
						<div class="red-background">
							<p>{this.inactive}</p>
						</div>
					</psk-grid>
				</div>
				:
				<div class="status-container" onClick={(evt: MouseEvent) => {
					this.closed = !this.closed;
					if (this.toggleEvent) {
						evt.preventDefault();
						evt.stopImmediatePropagation();

						let pskButtonEvent = new PskButtonEvent(this.toggleEvent, this.closed, {
							bubbles: true,
							composed: true,
							cancelable: true
						});

						let eventDispatcherElement = this.htmlElement;
						if (this.eventDispatcher) {
							if (ACCEPTED_DEFAULT_DISPATCHERS.indexOf(window[this.eventDispatcher]) !== -1) {
								eventDispatcherElement = window[this.eventDispatcher];
							}
						}
						eventDispatcherElement.dispatchEvent(pskButtonEvent);
					}
				}}>
					<h5>{this.title}</h5>
					<psk-grid class="two-options-container"
						columns={2}
						layout="xs=[6,6] s=[6,6] m=[6,6] l=[6,6]">
						<div class="red-background">
							<p>{this.active}</p>
						</div>
						<div class="left-container white-background">
							<p>{this.inactive}</p>
						</div>
					</psk-grid>
				</div>
		);
	}


}
