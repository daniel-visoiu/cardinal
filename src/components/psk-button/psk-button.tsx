import { Component, h, Prop, EventEmitter } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
	tag: 'psk-button',
	shadow: true
})
export class PskButton {
	@CustomTheme()
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

