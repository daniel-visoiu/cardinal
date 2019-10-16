import { Component, h, Event, EventEmitter, State, Prop, Listen } from '@stencil/core';

@Component({
	tag: 'psk-pin-popup',
	styleUrl: './psk-pin-popup.css',
	shadow: true
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

	sendPinHandler = (evt: CustomEvent): void => {
		evt.stopImmediatePropagation();
		this.sendPin.emit({
			pin: this.pin,
			callback: (err: string): void => {
				if (!err) {
					this.opened = false;
					this.errorMessage = null;
					return;
				}
				this.errorMessage = err;
			}
		});
	}

	handlePinKeyUp(evt): void {
		evt.stopImmediatePropagation();
		this.pin = evt.target.value;
		this.errorMessage = null;
	}

	render() {
		return (
			<psk-modal opened={this.opened}>
				<h3 slot="title">Enter your PIN</h3>

				<form role="form">
					<div class="form-group mx-sm-3 mb-2">
						<label htmlFor="pin" class={`col-form-label ${this.errorMessage !== null && 'text-danger'}`}>PIN</label>
						<input
							name="pin"
							type="password"
							class={`form-control ${this.errorMessage !== null && 'is-invalid'}`}
							id="pin"
							placeholder="PIN"
							onKeyUp={this.handlePinKeyUp.bind(this)}
							value={this.pin} />
						{this.errorMessage ? <span class="text-danger">{this.errorMessage}</span> : null}
					</div>
				</form>

				<button
					slot="confirm_action"
					class="btn btn-success mt-4 mb-4"
					disabled={this.pin.trim().length === 0}
					onClick={this.sendPinHandler.bind(this)}>
					Send PIN
                </button>
			</psk-modal>
		);
	}
}
