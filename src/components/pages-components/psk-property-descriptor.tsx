import { Component, h, Listen, State, Prop, Element } from "@stencil/core";
import { PropertyOptions } from "../../decorators/declarations/declarations";
import { normalizeElementId } from "../../utils/utilFunctions";

@Component({
    tag: "psk-property-descriptor"
})
export class PskPropertyDescriptor {
    @Element() __host: HTMLElement;

    @Prop() title: string = '';

    @State() decoratorProperties: Array<PropertyOptions> = [];

    @Listen('psk-send-props', { target: 'document' })
    receivedPropertiesDescription(evt: CustomEvent) {
        const targetTag = evt.detail.tag;
        const sourceTag = this.__host.children[0].tagName.toLowerCase();
        if (targetTag === sourceTag) {
            const props = evt.detail.props;
            evt.stopImmediatePropagation();
            if (props && props.length > 0) {
                this.decoratorProperties = JSON.parse(JSON.stringify(props));
            }
        }
    }

    async componentWillLoad() {
        this.__setDefineProp();
    }

    async connectedCallback() {
        this.__setDefineProp();
    }

    async componentDidLoad() {
        this.__setDefineProp();
    }

    __setDefineProp() {
        const element = this.__host.children[0];
        if (!element.hasAttribute('data-define-props')) {
            element.setAttribute('hidden', 'true');
            element.setAttribute('data-define-props', 'true');
        }
    }

    render() {
        let componentPropertiesDefinitions = this.decoratorProperties.map((prop: PropertyOptions) => {
            const cardSubtitle = `${prop.propertyName}${prop.isMandatory ? "" : "?"}: ${prop.propertyType} ${prop.isMandatory ? "(mandatory)" : "(optional)"}`;
            return (
                <psk-chapter-wrapper title={prop.propertyName}>
                    <p class="subtitle"><i>{cardSubtitle}</i></p>
                    {(
                      prop.description
                      ? Array.isArray(prop.description)
                          ? prop.description.map(line => <p innerHTML={line}/>)
                          : <p>{prop.description}</p>
                      : null
                    )}
                    {prop.specialNote ? (<p><b>Note: {prop.specialNote}</b></p>) : null}
                    {prop.defaultValue ? (<p><i>Default value: {prop.defaultValue}</i></p>) : null}
                </psk-chapter-wrapper>
            );
        });

        return (
            <psk-chapter title={this.title} id={normalizeElementId(this.title)}>
                {componentPropertiesDefinitions}
            </psk-chapter>
        );
    }
}
