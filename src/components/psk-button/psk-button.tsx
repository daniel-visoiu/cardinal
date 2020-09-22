import { Component, h, Prop, Element, Host } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from "../../events/PskButtonEvent";
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { BindModel } from '../../decorators/BindModel';
import {stringToBoolean} from "../../utils/utilFunctions";

const ACCEPTED_DEFAULT_DISPATCHERS = [document, window];

@Component({
	tag: 'psk-button',
	styleUrl: "../../assets/css/bootstrap/bootstrap.css"
})
export class PskButton {

	@BindModel() modelHandler;

	@CustomTheme()

	@Element() htmlElement: HTMLElement;

	render() {

    let disabled;
    let touched = false;
    let btnAttributes = {};
    let eventsListeners = {};

    if(typeof this.disabled === "string"){
      disabled = stringToBoolean(this.disabled);
    } else {
      disabled = Boolean(this.disabled);
    }

    if (disabled) {
      btnAttributes['disabled'] = disabled;
    }

    if (this.type) {
      btnAttributes['type'] = this.type;
      btnAttributes['value'] = this.eventName;
    }
    if(this.buttonClass.trim()){
      btnAttributes['class'] = this.buttonClass
    }

    if(this.eventName){
      eventsListeners['onClick'] = (evt: MouseEvent) => {
        this.handleClickEvent.call(this, evt, this.eventName);
      };
    }

    if(this.doubleClickEventName){
      eventsListeners['onDblClick'] = (evt: MouseEvent) => {
        this.handleClickEvent.call(this, evt, this.doubleClickEventName);
      };

      eventsListeners['onKeyUp'] = (evt: KeyboardEvent) => {
        evt.stopImmediatePropagation();
        evt.preventDefault();
        if (evt.key === 'Enter' || evt.code === "Enter") {
          this.handleClickEvent.call(this, evt, this.doubleClickEventName);
        }
      }
    }

    if(this.touchEventName){
      eventsListeners['onTouchStart'] = () => {
        touched = true;
        setTimeout(()=>{
          touched=false;
        },75)
      };

      eventsListeners['onTouchEnd'] = (evt) => {
        if(touched){
          this.handleClickEvent.call(this, evt, this.touchEventName);
          touched = false;
        }
      }
    }

		return (
		  <Host {...eventsListeners}>
			<button {...btnAttributes}>
				{this.label && this.label}
				<slot />
			</button>
      </Host>
		);
	}

	handleClickEvent = (evt: MouseEvent | KeyboardEvent, evName: string) => {

	  /*form submit event must be trusted*/

    if (this.type !== "submit") {
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
		description: ['This attribute has almost the same definition as the eventName attribute. The particularity of this one is that it will be triggered only on double-clicking the component.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() doubleClickEventName: string | null;

  @TableOfContentProperty({
    description: ['This attribute has almost the same definition as the eventName attribute. The particularity of this one is that it will be triggered only on touch the component.'],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() touchEventName: string | null;

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
    description: ['This attribute should be used when <code>psk-button</code> is a child in a <psk-link tag="psk-form">psk-form component</psk-link>.',
      'When used so, the button will act as a form action button: submit or reset',
      'Accepted values:<code>submit</code>,<code>reset</code>.'],
    isMandatory: false,
    propertyType: 'string',
    specialNote: ["If you miss this attribute in your psk-form component you will still be able to catch the event in your controller but the form validation will be skipped."]
  })
  @Prop() type: string;

	@TableOfContentProperty({
		description: ['This attribute is telling the component where to trigger the event. Accepted values: "document, "window".',
			'If the value is not set or it is not one of the accepted values, the eventDispatcher will be the component itself.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() eventDispatcher: string | null;
}
