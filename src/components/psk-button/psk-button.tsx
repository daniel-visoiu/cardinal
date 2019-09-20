import { Component, h, Prop, EventEmitter } from '@stencil/core';

@Component({
	tag: 'psk-button',
	styleUrl: './psk-button.css',
	shadow: true
})
export class PskButton {
	@Prop() label: string;
	@Prop() buttonClass: string = "btn btn-primary";
	@Prop() eventData: any;
	@Prop() eventEmitter: EventEmitter;
	@Prop() disabled: boolean = false;

	render() {
		return (
			<button onClick={() => {
				this.eventEmitter.emit(this.eventData)
			}} class={this.buttonClass}
				disabled={this.disabled}>
				<slot name="button_content" />
				{this.label ? this.label : null}
			</button>
		);
	}
}

