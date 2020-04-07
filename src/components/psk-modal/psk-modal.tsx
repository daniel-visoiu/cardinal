import { Component, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from '../../events/PskButtonEvent';
import { BindModel } from '../../decorators/BindModel';

@Component({
	tag: 'psk-modal',
  styleUrl:"../../../themes/commons/bootstrap/css/bootstrap.css",
	shadow: true
})
export class PskModal {
	@BindModel()

	@CustomTheme()

	@Element() private _host: HTMLElement;

	render() {
		return (
			<div>
				<div id="backdrop" onClick={this._closeModalHandler} />
				<div id="modal">
					<div class="modal-content">
						<div class="modal-header">
							<slot name="title" />
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true"
									onClick={this._closeModalHandler}>&times;</span>
							</button>
						</div>

						<div class="modal-body">
							<slot />
						</div>
					</div>
				</div>
			</div>
		);
	}

	_closeModalHandler = (evt: MouseEvent) => {
		if (this.eventName) {
			evt.preventDefault();
			evt.stopImmediatePropagation();

			let pskButtonEvent = new PskButtonEvent(this.eventName, null, {
				bubbles: true,
				composed: true,
				cancelable: true
			});

			this._host.dispatchEvent(pskButtonEvent);
		} else {
			this.closeModal.emit();
		}

	}

	@TableOfContentProperty({
		description: `This is the property that gives the state of the modal if it is opened or closed. The posible values are true or false.`,
		isMandatory: false,
		propertyType: `boolean`,
		defaultValue: 'false',
	})
	@Prop({ reflectToAttr: true, mutable: true }) opened: boolean = false;

	@TableOfContentEvent({
		eventName: `closeModal`,
		description: `When this event is triggered the Application Controller should listen to this so the modal can be closed within the controller.`
	})
	@Event({
		eventName: 'closeModal',
		composed: true,
		cancelable: true,
		bubbles: true,
	}) closeModal: EventEmitter;

	@TableOfContentProperty({
		description: ['By defining this attribute, the component will be able to trigger an event. The name of the event is the value of the attribute.'],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() eventName: string | null;
}
