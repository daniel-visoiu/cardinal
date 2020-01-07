import { h, Component, Prop, Event } from '@stencil/core';
import { EventEmitter } from '@stencil/router/dist/types/stencil.core';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';

@Component({
    tag: 'psk-radio'
})
export class PskRadio {

    @Prop() label?: string | null = null;
    @Prop() value?: string | null = null;
    @Prop() name?: string | null = null;

    @Prop() readOnly?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

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
}