import { Component, h, Element, State } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: 'psk-for-each'
})
export class PskForEach {

    @BindModel()

    @Element() private _host: HTMLElement;

    @State() children: Array<HTMLElement> = [];

    render() {
        if (!this['parentChain'] || !this['rootModel']
            || this._host.querySelectorAll("[view-model]").length === 0) {
            return <div></div>;
        }

        let parentChain: string = this['parentChain'];
        let rootModel = this['rootModel'];
        let templateModel = rootModel.getChainValue(parentChain);

        for (let index: number = 0; index < templateModel.length; ++index) {
            const fullParentChain: string = `${parentChain}.${index}`;

            let templateHTML: HTMLElement = this.__stringToHTMLElement('psk-container', this._host.outerHTML);

            console.log(templateHTML);

            let viewModelComponents: NodeList = templateHTML.querySelectorAll("[view-model]");

            viewModelComponents.forEach((component: HTMLElement) => {
                const fullChain: string = `${fullParentChain}.${component.getAttribute('view-model')}`;
                component.setAttribute('view-model', fullChain);
            });

            this.children.push(templateHTML);
        }

        return <div>
            {this.children}
        </div>;
    }

    __stringToHTMLElement(tag: string, html: string): HTMLElement {
        const HTMLTag = tag;
        return <HTMLTag innerHTML={html}></HTMLTag>;
    }
}