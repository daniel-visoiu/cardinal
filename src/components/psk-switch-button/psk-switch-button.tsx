import { Component, h, Prop, Element, State } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from "../../events/PskButtonEvent";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { BindModel } from '../../decorators/BindModel';

const ACCEPTED_DEFAULT_DISPATCHERS = [document, window];

@Component({
	tag: 'psk-switch-button'
})
export class PskSwitchButton {

	@BindModel() modelHandler;
	@CustomTheme()

	@Element() htmlElement: HTMLElement;
	@State() closed: boolean = false;
	@TableOfContentProperty({
		description: ['This attribute is the active part of the component the one that will show the content when the switch button is on.'],
		isMandatory: true,
		propertyType: 'string',
		defaultValue: null
	})
	@Prop() active: string | null;

	@TableOfContentProperty({
		description: 'This attribute is the inactive part of the component(this is the default value for the switch-button) the one that tells the user that the switch button is off.',
		isMandatory: true,
		propertyType: 'string',
		defaultValue: null
	})
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

	@TableOfContentProperty({
		description: `This property is the title, that will be be shown above the switch button for better understanding. `,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() title: string | null;

	clickHandler(evt: MouseEvent) {
		this.closed = !this.closed;
		if (this.toggleEvent) {
			evt.preventDefault();
			evt.stopImmediatePropagation();

			let pskButtonEvent = new PskButtonEvent(this.toggleEvent, {
				"selected": this.closed ? this.inactive : this.active,
				"active": this.active,
				"inactive" : this.inactive
			}, {
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
	}

	render() {
		let switchButton =
			<div class="status-container" >
				<h5>{this.title}</h5>
				<psk-hoc class="two-options-container" onClick={this.clickHandler.bind(this)}>
          <div class="row">
					<div class={`switch-item col-xs-6 col-sm-6 col-md-6 col-lg-6 ${this.closed ? "" : "selected"}`}>
						<p>{this.active}</p>
					</div>
					<div class={`switch-item col-xs-6 col-sm-6 col-md-6 col-lg-6 ${this.closed ? "selected" : ""}`}>
						<p>{this.inactive}</p>
					</div>
          </div>
				</psk-hoc>
			</div>

		return switchButton;
	}


}
