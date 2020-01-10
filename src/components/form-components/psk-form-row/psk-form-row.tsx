import { Component, h, Element } from '@stencil/core';

@Component({
    tag: 'psk-form-row'
})
export class PskForm {

    @Element() private __host: HTMLElement;

    render() {
        return <psk-grid columns={this.__host.children.length}>
            <slot />
        </psk-grid>;
    }
}