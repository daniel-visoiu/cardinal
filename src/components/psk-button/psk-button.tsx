import { Component, h, Prop } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import { createCustomEvent } from '../../utils/utils';

@Component({
	tag: 'psk-button',
	shadow: true
})
export class PskButton {
	@CustomTheme()

	@Prop() label: string | null = null;
	@Prop() buttonClass: string | null = "btn btn-primary";
	@Prop() eventName: string | null = null;
	@Prop() disabled: boolean = false;

	render() {
		return (
			<button onClick={(evt: MouseEvent) => {
				if (this.eventName) {
          evt.preventDefault();
          evt.stopImmediatePropagation();
					createCustomEvent(this.eventName, {
						bubbles: true, composed: true, cancelable: true
					}, true);
				}
			}} class={this.buttonClass}
				disabled={this.disabled}>
				{this.label && this.label}
				<slot />
			</button>
		);
	}
}
