import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
	tag: 'psk-input'
})
export class PskInput {

	@Prop() dataDate? : string
	@CustomTheme()

	@BindModel() modelHandler;

	render() {
		const invalidClass = this.invalidValue === null ? ''
			: this.invalidValue ? 'is-invalid' : 'is-valid';

		const inputName = this.name ? this.name
			: (this.label && this.label.replace(/( |:|\/|\.|-)/g, "").toLowerCase());
			
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
					onKeyUp={this.__keyUpHandler.bind(this)}
					{...this.specificProps} />
			</div>
		);
	}

	__keyUpHandler = (event) => {
		event.stopImmediatePropagation();
		let value = event.target.value;
      this.modelHandler.updateModel('value', value);
	};

	@TableOfContentProperty({
		description: [`Specifies the type psk-input to display.`,
			`The full list of type and explanations can be found at: <a href="https://www.w3schools.com/html/html_form_input_types.asp">HTML Input Types</a>`],
		isMandatory: false,
		propertyType: 'string',
		defaultValue: 'text',
		specialNote: `If no value is provided, "text" is assumed`
	})
	@Prop() type?: string = 'text';

	@TableOfContentProperty({
		description: [`By filling out this property, the component will display above it, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
		isMandatory: false,
		propertyType: 'string',
		specialNote: `If this property is not provided, the component will be displayed without any label`
	})
	@Prop() label?: string | null = null;

	@TableOfContentProperty({
		description: [`Specifies the value of an psk-input component.`,
		`This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link page="forms/using-forms">Using forms</psk-link>.`],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() value?: string | null = null;

	@TableOfContentProperty({
		description: [`Specifies the name of a psk-input component. It is used along with the psk-label component.`],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() name?: string | null = null;

	@TableOfContentProperty({
		description: [`Specifies a short hint that describes the expected value of an psk-input component`],
		isMandatory: false,
		propertyType: 'string'
	})
	@Prop() placeholder?: string | null = null;

	@TableOfContentProperty({
		description: [`Specifies that an input field must be filled out before submitting the form.`,
			`Accepted values: "true" and "false"`],
		isMandatory: false,
		propertyType: 'boolean'
	})
	@Prop() required?: boolean = false;

	@TableOfContentProperty({
		description: [`	Specifies that an input field is read-only.`,
			`Accepted values: "true" and "false"`],
		isMandatory: false,
		propertyType: 'boolean'
	})
	@Prop() readOnly?: boolean = false;

	@TableOfContentProperty({
		description: [`This property indicates if the value entered by the user is a valid one according to some validation present in the controller.`],
		isMandatory: false,
		propertyType: 'boolean'
	})
	@Prop() invalidValue?: boolean | null = null;

	@TableOfContentProperty({
		isMandatory: false,
		description: ``,
		propertyType: 'string'
	})
	@Prop() dataDateFormat? : string | null = null

	/**
	 * Property used only by other components
	 * psk-text-input, psk-email-input...
	 */
	@Prop() specificProps?: any = {};
}
