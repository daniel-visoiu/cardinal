import { Component, Element } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: 'psk-for-each'
})
export class PskForEach {

    @BindModel()
    @Element() private __host: HTMLElement;

    render() {
        this.__renderFormTemplateContent.call(this);

        console.log("[psk-for-each] finished Rendering!");
    }

    __renderFormTemplateContent(): any {
        const templateContent: HTMLTemplateElement = this.__getTemplateContent.call(this);
        if (templateContent === null) {
            console.error("[psk-for-each] Template content for the component is not defined");
            return null;
        }

        if (!this['parentChain'] || !this['rootModel']
            || templateContent.content.querySelectorAll("[view-model]").length === 0) {
            return null;
        }

        let parentChain: string = this['parentChain'];
        let rootModel = this['rootModel'];
        let templateModel = rootModel.getChainValue(parentChain);
        if (templateModel.length === 0) {
            console.error(`[psk-for-each] Template model defined as -=${parentChain}=- is not present in the rootModel`);
            return null;
        }

        this.__host.attachShadow({ mode: 'open' });
        for (let index = 0; index < templateModel.length; ++index) {
            const fullParentChain: string = `${parentChain}.${index}.`;
            this.__appendTemplateItem.call(this, fullParentChain, templateContent.content.cloneNode(true));
        }

        /**
         * Remove the template after rendering
         */
        templateContent.remove();
    }

    __getTemplateContent(): HTMLTemplateElement | null {
        const template: HTMLTemplateElement = this.__host.querySelector('template') as HTMLTemplateElement;
        return template ? template : null;
    }

    __appendTemplateItem(chain: string, clonedNode: DocumentFragment): void {
        let viewModelComponents = clonedNode.querySelectorAll("[view-model]");

        viewModelComponents.forEach((component: HTMLElement) => {
            const fullChain: string = `${chain}${component.getAttribute('view-model')}`;
            component.setAttribute('view-model', fullChain);
        });

        Array.from(clonedNode.childNodes).forEach((child: Node) => {
            this.__host.shadowRoot.appendChild(child);
        });
    }

    // componentDidRender() {
    //     if (!this['parentChain'] || !this['rootModel']
    //         || this.__host.querySelectorAll("[view-model]").length === 0) {
    //         return;
    //     }

    //     let parentChain: string = this['parentChain'];
    //     let rootModel = this['rootModel'];
    //     let templateModel = rootModel.getChainValue(parentChain);
    //     if (templateModel.length === 0) {
    //         return;
    //     }

    //     let formSections = Array.from(Array(templateModel.length).keys()).map((index: number) => {
    //         const fullParentChain: string = `${parentChain}.${index}.`;
    //         const templateHTMLCopy = this.templateHTML
    //             .map((element: HTMLStencilElement) => element.cloneNode(true) as Element);

    //         templateHTMLCopy.forEach(child => {
    //             let viewModelComponents = clonedNode.querySelectorAll("[view-model]");

    //             viewModelComponents.forEach((component: HTMLElement) => {
    //                 const fullChain: string = `${fullParentChain}${component.getAttribute('view-model')}`;
    //                 component.setAttribute('view-model', fullChain);
    //             });
    //         });

    //         return templateHTMLCopy;
    //     });

    //     this.displayedSesctions = formSections.map(section => {
    //         return (
    //             <for-each-template-item>
    //                 {section.map((sectionItem) => {
    //                     const SectionTag: string = sectionItem.tagName;
    //                     return <SectionTag innerHTML={sectionItem.innerHTML} />;
    //                 })}
    //             </for-each-template-item>
    //         )
    //     });
    // }
}