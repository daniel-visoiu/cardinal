import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: 'psk-checkbox'
})
export class PskCheckbox {

    @BindModel()

    @Prop() label?: string | null = null;
    @Prop() name?: string | null = null;
    @Prop() checkboxLabel?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() checked?: boolean = false;

    @Prop({ reflect: true, mutable: true }) value?: string = 'unchecked';

    @Prop() checkedValue?: string | null = null;
    @Prop() uncheckedValue?: string | null = null;

    render() {
        const checkboxName = this.name ? this.name
            : this.checkboxLabel ? this.checkboxLabel.replace(/\s/g, '').toLowerCase() : '';

        return (
            <div class="form-group">
                {/* Here, we display the label of the grouped checkbox component. Details in the documentation */}
                <psk-label label={this.label} />

                <div class="form-check">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        id={checkboxName}
                        name={checkboxName}
                        required={this.required}
                        checked={this.checked}
                        onChange={this.__handleCheckbox.bind(this)}
                        value={this.value} />
                    {/* This is the label for the checkbox */}
                    <psk-label for={checkboxName} label={this.checkboxLabel} />
                </div>
            </div>
        );
    }

    __handleCheckbox(evt): void {
        this.checked = evt.target.checked;
        if (evt.target.checked) {
            this.value = this.checkedValue ? this.checkedValue : "checked";
        } else {
            this.value = this.uncheckedValue ? this.uncheckedValue : "unchecked";
        }

        if (this['changeModel']) {
            this['changeModel'].call(this, 'value', this.value);
        } else {
            console.warn('[psk-input] Function named -=changeModel=- is not defined!');
        }
    }
}