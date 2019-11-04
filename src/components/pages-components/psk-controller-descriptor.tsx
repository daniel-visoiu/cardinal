import { Component, Prop, State, Listen, h } from "@stencil/core";
import { ControllerOptions } from "../../decorators/declarations/declarations";

@Component({
    tag: 'psk-controller-descriptor'
})

export class PskControllerDescriptor {

    @Prop() _title: string = "";

    @State() decoratorControllers: Array<ControllerOptions> = []

    @Listen('psk-send-controllers', { target: "document" })
    receivedControllersDescription(evt: CustomEvent) {
        const payload = evt.detail;
        evt.stopImmediatePropagation();
        if (payload && payload.length > 0) {
            this.decoratorControllers = JSON.parse(JSON.stringify(payload));
        }
    }

    render() {
        let componentControllersDefinitions = this.decoratorControllers.map((controller: ControllerOptions) => {
            const cardSubtitle = `${controller.controllerName}`;
            const events = `${controller.events}`
            return (
                <psk-hoc title={controller.controllerName}>
                    <p>{events}</p>
                    <p class="subtitle"><i>{cardSubtitle}</i></p>
                    <p>{controller.description}</p>
                    {controller.specialNote ? (<p><b>Note: {controller.specialNote}</b></p>) : null}
                </psk-hoc>
            );
        });
        return (
            <psk-chapter title={this._title} id={this._title.replace(/( |:|\/)/g, "-").toLowerCase()}>
                {componentControllersDefinitions}
            </psk-chapter>
        );
    }
}