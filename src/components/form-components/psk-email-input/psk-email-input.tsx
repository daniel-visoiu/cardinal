import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';

@Component({
    tag: 'psk-email-input'
})
export class PskEmailInput {

    @BindModel()

    @Prop() label?: string | null = null;
    @Prop() name?: string | null = null;
    @Prop() value?: string | null = null;
    @Prop() placeholder?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() readOnly?: boolean = false;
    @Prop() invalidValue?: boolean | null = null;

    render() {
        return <psk-input
            type="email"
            label={this.label}
            name={this.name}
            value={this.value}
            placeholder={this.placeholder}
            required={this.required}
            readOnly={this.readOnly}
            invalidValue={this.invalidValue}
            specificProps={{
                onKeyUp: this.__inputHandler.bind(this),
                onChange: this.__inputHandler.bind(this)
            }} />
    }

    __inputHandler = (event) => {
        event.stopImmediatePropagation();
        let value = event.target.value;
        if (this['changeModel']) {
            this['changeModel'].call(this, 'value', value);
        } else {
            console.warn('[psk-input] Function named -=changeModel=- is not defined!');
        }
    };
}
