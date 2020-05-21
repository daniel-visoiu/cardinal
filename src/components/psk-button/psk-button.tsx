import { Component, h, Prop, Element } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from "../../events/PskButtonEvent";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { BindModel } from '../../decorators/BindModel';
import {stringToBoolean} from "../../utils/utilFunctions";

const ACCEPTED_DEFAULT_DISPATCHERS = [document, window];

@Component({
	tag: 'psk-button',
	styleUrl: "../../../themes/commons/bootstrap/css/bootstrap.css",
	shadow: true
})
export class PskButton {

	@BindModel() modelHandler;

	@CustomTheme()

	@Element() htmlElement: HTMLElement;

	render() {

    let disabled;
    if(typeof this.disabled === "string"){
      disabled = stringToBoolean(this.disabled);
    } else {
      disabled = Boolean(this.disabled);
    }

		return (
			<button class={this.buttonClass} disabled={disabled}
				onClick={(evt: MouseEvent) => {
					this.handleClickEvent.call(this, evt, this.eventName);
				}}
				onDblClick={(evt: MouseEvent) => {
					this.handleClickEvent.call(this, evt, this.doubleClickEventName);
				}}
				onKeyUp={(evt: KeyboardEvent) => {
					evt.stopImmediatePropagation();
					evt.preventDefault();
					if (evt.key === 'Enter' || evt.keyCode === 13) {
						this.handleClickEvent.call(this, evt, this.doubleClickEventName);
					}
				}}>
				{this.label && this.label}
				<slot />
			</button>
		);
	}

	handleClickEvent = (evt: MouseEvent | KeyboardEvent, evName: string) => {
		evt.stopImmediatePropagation();
		evt.preventDefault();

		if (evName) {
			let pskButtonEvent = new PskButtonEvent(evName, this.eventData, {
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

	@TableOfContentProperty({
		description: ['This is the label that will be displayed for the button. If it is not set, the label will not be displayed.',
			'Also, the component has a slot which can be used to set the label for the component.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() label: string | null;

	@TableOfContentProperty({
		description: ['This attribute is used to provide a set of CSS classes, defined inside psk-button.css, that will be used as design for this component.'],
		isMandatory: false,
		propertyType: 'string',
		defaultValue: 'btn btn-primary'
	})
	@Prop() buttonClass: string | null = "btn btn-primary";

	@TableOfContentProperty({
		description: ['By defining this attribute, the component will be able to trigger an event. The name of the event is the value of the attribute.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() eventName: string | null;

	@TableOfContentProperty({
		description: ['This attribute has almost the same definiton as the eventName attribute. The particularity of this one is that it will be triggered only on double-clicking the component.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() doubleClickEventName: string | null;

	@TableOfContentProperty({
		description: ['This attribute is used to pass some information along with an event.',
			'This attribute is taken into consideration only if the eventName has a value. If not, it is ignored.'],
		isMandatory: false,
		propertyType: 'any'
	})
	@Prop() eventData: any | null;

	@TableOfContentProperty({
		description: ['By defining this attribute, you tell the component if it is disabled or not.',
			'Possible values: "true", "false".'],
		isMandatory: false,
		propertyType: 'boolean',
		defaultValue: 'false'
	})
	@Prop() disabled: string | boolean = "false";

	@TableOfContentProperty({
		description: ['This attribute is telling the component where to trigger the event. Accepted values: "document, "window".',
			'If the value is not set or it is not one of the accepted values, the eventDispatcher will be the component itself.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() eventDispatcher: string | null;
}
