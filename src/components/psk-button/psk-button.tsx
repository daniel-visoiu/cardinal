import { Component, h, Prop} from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from "../../events/PskButtonEvent";

@Component({
	tag: 'psk-button',
	shadow: true
})
export class PskButton {
	@CustomTheme()

	@Prop() label: string | null = null;
	@Prop() buttonClass: string | null = "btn btn-primary";
	@Prop() eventName: string | null = null;
	@Prop() eventData: any | null = null;
	@Prop() disabled: boolean = false;

	render() {
		return (
			<button onClick={(evt: MouseEvent) => {
				if (this.eventName) {
					evt.preventDefault();
					evt.stopImmediatePropagation();

          let pskButtonEvent = new PskButtonEvent(this.eventName, this.eventData, {
            bubbles: true,
            composed: true,
            cancelable: true
          });
          //button is in shadow root
          document.dispatchEvent(pskButtonEvent);
				}
			}} class={this.buttonClass}
				disabled={this.disabled}>
				{this.label && this.label}
				<slot />
			</button>
		);
	}
}
