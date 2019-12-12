import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';

@Component({
	tag: 'psk-input'
})
export class PskInput {

	@BindModel()

	@Prop() label?: string | null = null;
	@Prop() type?: string = 'text';
	@Prop() value?: string | null = null;
	@Prop() name?: string | null = null;
	@Prop() placeholder?: string | null = null;

	@Prop() required?: boolean = false;
	@Prop() readOnly?: boolean = false;
	@Prop() invalidValue?: boolean | null = null;

	keyUpHandler = (event) => {
		event.stopImmediatePropagation();
		let value = event.target.value;
		if (this['changeModel']) {
			this['changeModel'].call(this, 'value', value);
		} else {
			console.warn('[psk-input] Function named -=changeModel=- is not defined!');
		}
	};

	render() {
		const invalidClass = this.invalidValue === null ? ''
			: this.invalidValue ? 'is-invalid' : 'is-valid';

		const inputName = this.name ? this.name
			: (this.label && this.label.replace(/\s/g, '').toLowerCase());

		return (
			<div class={`form-group`}>
				{this.label && <psk-label for={inputName} label={this.label} />}

				<input
					type={this.type}
					value={this.value}
					name={inputName}
					class={`form-control ${invalidClass}`}
					placeholder={this.placeholder}
					required={this.required}
					readOnly={this.readOnly}
					onKeyUp={this.keyUpHandler.bind(this)} />
			</div>
		);
	}
}
