import { Component, h, Prop, Element, State } from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme.js';
import ControllerRegistryService from "../../../services/ControllerRegistryService";
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty.js';

@Component({
    tag: 'psk-form',
    styleUrls: [
      "../../../../themes/commons/fonts/font-awesome.min.css",
      "../../../../themes/commons/bootstrap/css/bootstrap.min.css"],
    shadow: true
})
export class PskForm {

    @CustomTheme()

    @State() controller: any | null;
    @State() disconnected: boolean | false;

    connectedCallback() {
        this.disconnected = false;
    }
    disconnectedCallback() {
        this.disconnected = true;
    }

    componentWillLoad(): Promise<any> {
        if (typeof this.controllerName === "string") {
            return new Promise((resolve, reject) => {
                ControllerRegistryService.getController(this.controllerName).then((CTRL) => {
                    // Prevent javascript execution if the node has been removed from DOM
                    if (this.disconnected) {
                        return resolve();
                    }
                    this.controller = new CTRL(this._host);
                    resolve();
                }).catch(reject);
            })
        }
    }

    render() {
        return (
            <div class="container">
                <form>
                    <slot />

                    {this._createFormActions(this.formActions)}
                </form>
            </div>
        );
    }

    _createFormActions(formActions: string): HTMLElement {
        if (formActions.trim().length === 0) {
            return null;
        }

        let actions: Array<HTMLElement> = [];

        actions = formActions.split(",").map((action: string) => {
            return <psk-button
                button-class={action}
                event-name={action}
                label={action} />
        });

        return (
            <div id="actions" class="container-fluid">
                {actions}
            </div>
        );
    }

    @TableOfContentProperty({
        description: ['This attributes is setting the controller of the form. The default value for this attribute is FormController, a default controller for handling form submitions created inside Cardinal.Js.',
            'Information about creating a controller can be found inside the documentation: <psk-link page="Cardinal/controllers">Controllers Documentation</psk-link>',
            'All the '],
        isMandatory: false,
        propertyType: 'string',
        defaultValue: "FormController",
        specialNote: "If the controller name is not provided, then the default FormController is assumed."
    })
    @Prop() controllerName: string | null;

    @TableOfContentProperty({
        description: [`By defining this attribute, the user is able to control the behaviour of the form, so by definition, this attribute holds the possible actions inside the form, the defined actions should be sepparated by comma(",").`,
            `Also, as a recommendation, the values should be provided using lowercases, and if there are more words inside an action, to be written using dash symbol(-)`,
            `Example of form actions: submit, reset-form, validate-form, cancel`,
            `Using all these actions, the component will generate a <psk-link page="web-components/psk-button">psk-button</psk-link>.`,
            `If this attribute is not defined, you can also add <psk-link page="web-components/psk-button">psk-button</psk-link> components anywhere in the form. The rule is the same, the event-name attribute assigned to the psk-button component needs to be registered in the form's controller.`],
        isMandatory: false,
        propertyType: 'string values sepparated by comma (,)',
        defaultValue: "null",
        specialNote: ["If this attribute has no value, then the form will have no actions."]
    })
    @Prop() formActions?: string | null = '';

    @Element() private _host: HTMLElement;
}
