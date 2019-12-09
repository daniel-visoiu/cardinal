import { Component, h, Prop, Element } from '@stencil/core';

@Component({
    tag: 'psk-template-iterator'
})
export class PskTemplateIterator {

    @Prop({ mutable: true, reflect: true }) model: string | null = null;

    @Element() private _host: HTMLElement;

    componentWillLoad() {
        console.log(this._host);
        console.log("To be continued after binding implementation...");
    }

    render() {
        return (
            <slot />
        );
    }
}