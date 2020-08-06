import { Component, Prop, State, Listen, h } from "@stencil/core";
import { EventOptions } from "../../decorators/declarations/declarations";
import {normalizeElementId} from "../../utils/utilFunctions";

@Component({
    tag: 'psk-controller-descriptor'
})

export class PskControllerDescriptor {

    @Prop() title: string = "";

    @State() decoratorControllers: Array<EventOptions> = []

    @Listen('psk-send-controllers', { target: "document" })
    receivedControllersDescription(evt: CustomEvent) {
        const payload = evt.detail;
        evt.stopImmediatePropagation();
        if (payload && payload.length > 0) {
            this.decoratorControllers = JSON.parse(JSON.stringify(payload));
        }
    }

    render() {
        let componentControllersDefinitions = this.decoratorControllers.map((controller: EventOptions) => {
            const cardSubtitle = `${controller.eventName}: CustomEvent`;
            const required = `Required : ${controller.controllerInteraction.required}`
            return (
                <psk-chapter-wrapper title={controller.eventName}>
                    <p class="subtitle"><i>{cardSubtitle}</i></p>
                    <p class="subtitle"><b>{required}</b></p>
                    <p>{controller.description}</p>
                    {controller.specialNote ? (<p><b>Note: {controller.specialNote}</b></p>) : null}
                </psk-chapter-wrapper>
            );
        });
        return (
            <psk-chapter title={this.title} id={normalizeElementId(this.title)}>
                {componentControllersDefinitions}
            </psk-chapter>
        );
    }
}
