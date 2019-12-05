import { h, Component, Prop } from '@stencil/core';

@Component({
    tag: 'psk-input'
})
export class PskInput {

    @Prop() label?: string | null = null;
    @Prop() type?: string = 'text';
    @Prop() value?: string | null = null;
    @Prop() name?: string | null = null;
    @Prop() defaultValue?: string | null = null;
    @Prop() placeHolder?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() readOnly?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

    render() {
        const invalidClass = this.invalidValue === null ? ''
            : this.invalidValue ? 'is-invalid' : 'is-valid';

        const inputValue = this.value !== null ? this.value
            : this.defaultValue !== null ? this.defaultValue : '';

        return (
            <div class={`form-group`}>
                <psk-label for={name} label={this.label} />

                <input
                    type={this.type}
                    value={inputValue}
                    name={this.label && this.label.replace(/\s/g, '').toLowerCase()}
                    class={`form-control ${invalidClass}`}
                    placeholder={this.placeHolder} />
            </div>
        );
    }
}