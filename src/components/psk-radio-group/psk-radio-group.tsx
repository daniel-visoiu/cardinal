import { h, Component, Prop, Listen, Element, State } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';
import { RadioOption } from '../../interfaces/FormModel';

@Component({
    tag: 'psk-radio-group'
})
export class PskRadioGroup {

    @BindModel()

    @Prop() label: string | null = null;
    @Prop() name?: string | null = null;

    @Prop() required?: boolean = false;
    @Prop() invalid?: boolean = true;

    @Prop({ reflect: true, mutable: true }) value?: string | null = null;

    @State() options: Array<RadioOption> = null;

    @Element() private _host: HTMLElement;

    @Listen('onChangeRadio')
    onChangeRadioHandler(evt: CustomEvent): void {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        if (!evt.detail || !evt.detail.value) {
            return;
        }
        const radioButtons = this._host.querySelectorAll("psk-radio");
        radioButtons.forEach((radio: Element) => {
            const inputRadio: HTMLInputElement = radio.getElementsByTagName('input')[0];
            if (inputRadio.value === evt.detail.value) {
                this.value = evt.detail.value;
                this.__updateModel.call(this);
                inputRadio.checked = true;
            } else {
                inputRadio.checked = false;
            }
        });
    }

    render() {
        return (
            <div class="form-group">
                <psk-label for={this.name} label={this.label} />

                <div id="psk-radio-group"
                    class={`form-group`}>
                    {this.options && this.options.map((option: RadioOption) => {
                        const inputName = option.name ? option.name
                            : (option.label && option.label.replace(/\s/g, '').toLowerCase());

                        return <psk-radio {...option}
                            name={inputName} />
                    })}
                    <slot />
                </div>
            </div>
        );
    }

    __updateModel(): void {
        if (this['changeModel']) {
            this['changeModel'].call(this, 'value', this.value);
        } else {
            console.warn('[psk-radio-group] Function named -=changeModel=- is not defined!');
        }
    }
}