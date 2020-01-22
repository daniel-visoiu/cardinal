import { Component, h, Element } from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
    tag: 'psk-form-row'
})
export class PskForm {

    @CustomTheme()

    @Element() private __host: HTMLElement;

    render() {
        return <psk-grid columns={this.__host.children.length}>
            <slot />
        </psk-grid>;
    }
}