import { Component, h, Event, EventEmitter, State, Prop, Listen } from '@stencil/core';

@Component({
	tag: 'psk-pin-popup',
	styleUrl: './psk-pin-popup.css'
})
export class PskPinPopup {
	@Prop({ reflectToAttr: true, mutable: true }) opened: boolean = false;

	@State() pin: string = '';
	@State() errorMessage: string = null;

	@Listen('closeModal')
	closePinPopup(evt: CustomEvent): void {
		evt.stopImmediatePropagation();
		this.opened = false;
	}

	@Event({
		eventName: "sendPin",
		bubbles: true,
		cancelable: true,
		composed: true
	}) sendPin: EventEmitter;

	sendPinHandler(evt: CustomEvent): void {
		evt.stopImmediatePropagation();
		this.sendPin.emit({
			pin: this.pin,
			callback: function (err) {
				if (!err) {
					this.opened = false;
					return;
				}
				this.errorMessage = err;
			}
		});
	}

	handlePinKeyUp(evt): void {
		evt.stopImmediatePropagation();
		this.pin = evt.target.value;
	}

	render() {
		return (
			<psk-modal opened={this.opened}>
				<h3 slot="title">Enter your PIN</h3>

				<form class="form-inline">
					<div class="form-group mx-sm-3 mb-2">
						<label htmlFor="pin" class="sr-only">PIN</label>
						<input
							name="pin"
							type="password"
							class="form-control"
							id="pin"
							placeholder="PIN"
							onKeyUp={this.handlePinKeyUp.bind(this)}
							value={this.pin} />
					</div>
				</form>

				<button
					slot="confirm_action"
					class="btn btn-success"
					disabled={this.pin.trim().length === 0}
					onClick={this.sendPinHandler.bind(this)}>
					Send PIN
                </button>
			</psk-modal>
		);
	}
}
