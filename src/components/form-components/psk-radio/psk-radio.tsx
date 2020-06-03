import { h, Component, Prop, Event } from '@stencil/core';
import { EventEmitter } from '@stencil/router/dist/types/stencil.core';
import { TableOfContentEvent } from '../../../decorators/TableOfContentEvent';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';
import { BindModel } from '../../../decorators/BindModel';

@Component({
    tag: 'psk-radio'
})
export class PskRadio {

    @CustomTheme()

    @BindModel() modelHandler

    render() {
        const inputName = this.name ? this.name
            : (this.label && this.label.replace(/\s/g, '').toLowerCase());

        const inputValue = this.value ? this.value : inputName;
        return (
            <div class="form-check form-check-inline">
                <input
                    type="radio"
                    class="form-check-input"
                    value={inputValue}
                    name={inputName}
                    readOnly={this.readOnly}
                    checked={this.checked}
                    onChange={this.__handleRadioChange.bind(this)} />
                <psk-label for={inputName} label={this.label} />
            </div>
        );
    }

    __handleRadioChange(evt): void {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.onChangeRadio.emit({
            value: evt.target.value
        });
    }

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display near it, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() label?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the value of a psk-radio component.`,
            `This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link page="forms/using-forms">Using forms</psk-link>.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() value?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the name of a psk-radio component. It is used along with the psk-label component.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() name?: string | null = null;

    @TableOfContentProperty({
        description: [`	Specifies that a psk-radio is read-only and it cannot be changed.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() readOnly?: boolean = false;

    @TableOfContentProperty({
        description: [`This property indicates if the value entered by the user is a valid one according to some validation present in the controller.`],
        isMandatory: false,
        propertyType: 'boolean'
    })
    @Prop() invalidValue?: boolean | null = null;

    @TableOfContentProperty({
        description: [`This property indicates the status of the component, if it checked or not. Also, by using this property, you can set the default value of the radio, in case you need it to be checked.`],
        isMandatory: false,
        propertyType: 'boolean'
    })
    @Prop({ mutable: true, reflect: true }) checked?: boolean = false;

    @TableOfContentEvent({
        description: ["This event is being triggered when a radio button is checked.",
            "The event bubbles to the parent component, psk-radio-group, where the component will handle the selection of the radio."],
        specialNote: "This event is not composed, it will not bubble outside the form!"
    })
    @Event({
        eventName: 'onChangeRadio',
        bubbles: true,
        composed: false,
        cancelable: true
    }) onChangeRadio: EventEmitter;
}
