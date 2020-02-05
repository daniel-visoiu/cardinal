import { Component, Element, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';
import { canAttachShadow } from '../../../utils/utils';

@Component({
    tag: 'psk-for-each'
})
export class PskForEach {

    @CustomTheme()

    @BindModel()
    @Element() private __host: HTMLElement;

    render() {
        this.__renderFormTemplateContent.call(this);
    }

    __renderFormTemplateContent(): any {
        const templateContent: HTMLTemplateElement = this.__getTemplateContent.call(this);
        if (templateContent === null) {
            console.error("[psk-for-each] Template content for the component is not defined");
            return null;
        }

        if (!this['parentChain'] || !this['rootModel']) {
            return null;
        }

        if (templateContent.getAttribute('done') === 'done') {
            templateContent.removeAttribute('done');
            return null;
        }

        let parentChain: string = this['parentChain'];
        let rootModel = this['rootModel'];
        let templateModel = rootModel.getChainValue(parentChain);
        if (templateModel.length === 0) {
            console.error(`[psk-for-each] Template model defined as -=${parentChain}=- is not present in the rootModel`);
            return null;
        }

        let parentComponent = this.__host.parentElement;

        if (parentComponent.shadowRoot) {
            if (parentComponent.shadowRoot.querySelector('slot') !== null) {
                parentComponent = parentComponent.shadowRoot.querySelector('slot').parentElement;
            }
        } else {
            if (parentComponent.querySelector('slot') !== null) {
                parentComponent = parentComponent.querySelector('slot').parentElement;
            }
        }

        /**
         * Attach ShadowRoot to the parent component so the content is not cloned in a wrong manner
         * This is a Stencil.Js issue
         */
        if (!parentComponent.shadowRoot && canAttachShadow(parentComponent.tagName)) {
            parentComponent.attachShadow({ mode: 'open' });
        }

        for (let index = 0; index < templateModel.length; ++index) {
            const fullParentChain: string = `${parentChain}.${index}.`;
            this.__appendTemplateItem.call(this, fullParentChain, templateContent.content.cloneNode(true), parentComponent);
        }

        templateContent.setAttribute("done", "done");
    }

    __getTemplateContent(): HTMLTemplateElement | null {
        const template: HTMLTemplateElement = this.__host.querySelector('template') as HTMLTemplateElement;
        return template ? template : null;
    }

    __processNode(node: Element, chain: string): void {
        let nodeAttributes = Array.from(node.attributes)
            .filter((attr: Attr) => attr.name.startsWith("view-model-"));

        nodeAttributes.forEach((attr: Attr) => {
            const property = attr.name.split("view-model-")[1];
            const fullChain = chain ? `${chain}${attr.value}` : attr.value;

            node.setAttribute(property, this['rootModel'].getChainValue(fullChain));
        });

        nodeAttributes = Array.from(node.attributes)
            .filter((attr: Attr) => attr.value.startsWith("@"));

        nodeAttributes.forEach((attr: Attr) => {
            const property = attr.value.split("@")[1];
            const fullChain = chain ? `${chain}${property}` : property;

            node.setAttribute(attr.name, this['rootModel'].getChainValue(fullChain));
        });

        Array.from(node.children).forEach((node: Element) => {
            this.__processNode.call(this, node, chain);
        });
    }

    __appendTemplateItem(chain: string, clonedNode: DocumentFragment, parentComponent: HTMLElement): void {
        let viewModelComponents = clonedNode.querySelectorAll("[view-model]");

        let childNodes = Array.from(clonedNode.children);
        childNodes.forEach((node: Element) => {
            this.__processNode.call(this, node, chain);
        });

        viewModelComponents.forEach((component: HTMLElement) => {
            const fullChain: string = `${chain}${component.getAttribute('view-model')}`;
            component.setAttribute('view-model', fullChain);
            component.setAttribute('get-model', 'get-model');
        });

        Array.from(clonedNode.childNodes).forEach((child: Node) => {
            if (parentComponent.shadowRoot) {
                parentComponent.shadowRoot.append(child);
            } else {
                parentComponent.append(child);
            }
        });
    }

    @TableOfContentProperty({
        description: [`This property is the name of the model which will be used to generate the form. The model should be a JavaScript array.`,
            `All the information about how to write a model, hot to use the two-way binding and how to use the model with this component cand be found in the documentation found at: <psk-link page="forms/using-forms">Using forms</psk-link>`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: [`If this property is not provided, nothing written inside the component's template will be displayed.`]
    })
    @Prop() dataViewModel?: string | null = null;
}
