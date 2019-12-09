import { h, Component, Prop, Listen, Element } from '@stencil/core';

@Component({
    tag: 'psk-radio-group'
})
export class PskRadioGroup {

    @Prop() label: string | null = null;
    @Prop() name?: string | null = null;

    @Prop() invalid?: boolean = true;

    @Prop({ reflect: true, mutable: true }) selectedValue?: string | null = null;

    @Element() private _host: HTMLElement;

    @Listen('onChangeRadio')
    onChangeRadioHandler(evt: CustomEvent): void {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        if (!evt.detail || !evt.detail.value) {
            return;
        }

        const radioButtons = this._host.querySelectorAll("psk-radio");
        for (let index = 0; index < radioButtons.length; ++index) {
            let radio = radioButtons[index];
            if (radio.getAttribute('value') === evt.detail.value) {
                this.selectedValue = evt.detail.value;
                radio.setAttribute('checked', 'true');
            } else {
                radio.setAttribute('checked', 'false');
            }
        }
    }

    render() {
        return (
            <div class="form-group">
                <psk-label for={this.name} label={this.label} />

                <div id="psk-radio-group"
                    class={`form-group`}>
                    <slot />
                </div>
            </div>
        );
    }
}