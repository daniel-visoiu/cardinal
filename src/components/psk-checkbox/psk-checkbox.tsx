import { h, Component, Prop } from '@stencil/core';

@Component({
    tag: 'psk-checkbox'
})
export class PskCheckbox {

    @Prop() label?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() checked?: boolean = false;

    render() {
        return (
            <div class={`form-group`}>
                <div class="form-check">
                    <input
                        type="checkbox"
                        id={this.label && this.label.replace(/\s/g, '').toLowerCase()}
                        checked={this.checked}
                        required={this.required}
                        name={this.label && this.label.replace(/\s/g, '').toLowerCase()}
                        class={`form-check-input`} />

                    {this.label && <label
                        class="form-check-label"
                        htmlFor={this.label.replace(/\s/g, '').toLowerCase()}>
                        {this.label}
                    </label>}
                </div>
            </div>
        );
    }
}