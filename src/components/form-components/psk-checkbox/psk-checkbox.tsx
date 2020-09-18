import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';
import {stringToBoolean} from "../../../utils/utilFunctions";

@Component({
    tag: 'psk-checkbox'
})
export class PskCheckbox {

    @CustomTheme()

    @BindModel() modelHandler;

    render() {
        const checkboxName = this.name ? this.name
            : this.checkboxLabel ? this.checkboxLabel.replace(/\s/g, '').toLowerCase() : '';

        let isChecked = stringToBoolean(this.checked);
        const checkboxHtml = (
            <div class="form-group">
                <div class="form-check form-check-inline">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        id={checkboxName}
                        name={checkboxName}
                        required={this.required}
                        defaultChecked={isChecked}
                        onChange={this.__handleCheckbox.bind(this)}
                        value={this.value}
                        />
                    {/* This is the label for the checkbox */}
                    <psk-label for={checkboxName} label={this.checkboxLabel} />
                </div>
            </div>
        );

        return this.label
            ? (
                <div class="form-group">
                    {/* Here, we display the label of the grouped checkbox component. Details in the documentation */}
                    <psk-label label={this.label} />
                    {checkboxHtml}
                </div>
            )
            : checkboxHtml;
    }

    __handleCheckbox(evt): void {
        this.checked = evt.target.checked;
        if (evt.target.checked) {
            this.value = this.checkedValue ? this.checkedValue : true;
        } else {
            this.value = this.uncheckedValue ? this.uncheckedValue : false;
        }
        this.modelHandler.updateModel('value', this.value);
    }

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display above it, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() label: string;

    @TableOfContentProperty({
        description: [`Specifies the name of a psk-checkbox component. It is used along with the psk-label component.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() name?: string | null = null;

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display near the checkbox, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() checkboxLabel;

    @TableOfContentProperty({
        description: [`Specifies that the psk-checkbox must be checked before submitting the form.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() required?: boolean = false;

    @TableOfContentProperty({
        description: [`This property indicates the status of the component, if it checked or not. Also, by using this property, you can set the default value of the psk-checkbox, in case you need it to be checked.`],
        isMandatory: false,
        propertyType: 'boolean'
    })
    @Prop() checked?: string = null;

    @TableOfContentProperty({
        description: [`Specifies the value of a psk-checkbox component.`,
            `This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link tag="using-forms">Using forms</psk-link>.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop({ reflect: true, mutable: true }) value?: any = false;

    @TableOfContentProperty({
        description: [`Specifies the value that will be assigned to the component when it is checked.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() checkedValue?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the value that will be assigned to the component when it is unchecked.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() uncheckedValue?: string | null = null;
}
