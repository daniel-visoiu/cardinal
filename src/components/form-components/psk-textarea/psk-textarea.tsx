import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
    tag: 'psk-textarea'
})
export class PskTextArea {

    @CustomTheme()

    @BindModel() modelHandler;

    render() {
        const invalidClass = this.invalidValue === null ? ''
            : this.invalidValue ? 'is-invalid' : 'is-valid';
        return (
            <div class={`form-group`}>
                {this.label && <psk-label for={this.name} label={this.label} />}

                <textarea
                    name={this.name}
                    value={this.value}
                    placeholder={this.placeholder}
                    required={this.required}
                    class={`form-control ${invalidClass}`}
                    readOnly={this.readOnly}
                    onKeyUp={this.__inputHandler.bind(this)}
                    onChange={this.__inputHandler.bind(this)} />
            </div>
        );
    }

    __inputHandler = (event) => {
        event.stopImmediatePropagation();
        let value = event.target.value;
        this.modelHandler.updateModel('value', value);
    };

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display above it, a label using <psk-link tag="psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() label?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the value of an psk-textarea component.`,
            `This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link tag="using-forms">Using forms</psk-link>.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() value?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the name of a psk-textarea component. It is used along with the psk-label component.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() name?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies a short hint that describes the expected value of the psk-textarea component`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() placeholder?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies that the textarea field must be filled out before submitting the form.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean'
    })
    @Prop() required?: boolean = false;

    @TableOfContentProperty({
        description: [`	Specifies that the textarea input field is read-only.`,
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

}
