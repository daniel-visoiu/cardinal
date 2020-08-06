import { Component, h, Listen, State, Prop } from "@stencil/core";
import { PropertyOptions } from "../../decorators/declarations/declarations";
import {normalizeElementId} from "../../utils/utilFunctions";

@Component({
    tag: "psk-property-descriptor"
})
export class PskPropertyDescriptor {

    @Prop() title: string = "";

    @State() decoratorProperties: Array<PropertyOptions> = [];

    @Listen('psk-send-props', { target: "document" })
    receivedPropertiesDescription(evt: CustomEvent) {
        const payload = evt.detail;
        evt.stopImmediatePropagation();
        if (payload && payload.length > 0) {
            this.decoratorProperties = JSON.parse(JSON.stringify(payload));
        }
    }

    render() {
        let componentPropertiesDefinitions = this.decoratorProperties.map((prop: PropertyOptions) => {
            const cardSubtitle = `${prop.propertyName}${prop.isMandatory ? "" : "?"}: ${prop.propertyType} ${prop.isMandatory ? "(mandatory)" : "(optional)"}`;
            return (
                <psk-chapter-wrapper title={prop.propertyName}>
                    <p class="subtitle"><i>{cardSubtitle}</i></p>
                    {
                        Array.isArray(prop.description)
                            ? prop.description.map(line => <p innerHTML={line}></p>)
                            : <p>{prop.description}</p>
                    }
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
