import { h, Component, Prop } from '@stencil/core';

@Component({
    tag: 'psk-checkbox'
})
export class PskCheckbox {

    @Prop() label?: string | null = null;
    @Prop() name?: string | null = null;
    @Prop() checkboxLabel?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() checked?: boolean = false;

    render() {
        const checkboxName = this.name ? this.name
            : this.checkboxLabel ? this.checkboxLabel.replace(/\s/g, '').toLowerCase() : '';

        return (
            <div class="form-group">
                {/* Here, we display the label of the grouped checkbox component. Details in the documentation */}
                <psk-label for={this.label.replace(/\s/g, '').toLowerCase()} label={this.label} />

                <div class="form-check">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        id={checkboxName}
                        name={checkboxName}
                        required={this.required}
                        checked={this.checked} />
                    {/* This is the label for the checkbox */}
                    <psk-label for={checkboxName} label={this.checkboxLabel} />
                </div>
            </div>
        );
    }
}