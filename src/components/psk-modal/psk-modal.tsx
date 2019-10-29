import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';

@Component({
	tag: 'psk-modal',
	styleUrl: './psk-modal.css',
	shadow: true
})
export class PskModal {

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

	render() {
		return (
			<div>
				<div id="backdrop" onClick={() => {
					this.closeModal.emit();
				}} />
				<div id="modal">
					<div class="modal-content">
						<div class="modal-header">
							<slot name="title" />
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true"
									onClick={() => {
										this.closeModal.emit();
									}}>&times;</span>
							</button>
						</div>

						<div class="modal-body">
							<slot />
						</div>
						<div class="modal-footer">
							<slot name="confirm_action" />
							<button class="btn btn-primary" onClick={() => {
								this.closeModal.emit();
							}}>Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
