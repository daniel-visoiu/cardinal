import {Component, h, Prop, Element, State} from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme.js';
import ControllerFactory from "../../../services/ControllerFactory";
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty.js';

@Component({
    tag: 'psk-form',
    shadow: true
})
export class PskForm {

    @CustomTheme()

    @State() ctrlIsReady = false;
    @State() controller: any | null;


  constructor() {
    const controllerNameForInstance = this.controllerName ? this.controllerName : 'Controller';

    ControllerFactory.getController(controllerNameForInstance).then((CTRL) => {
      this.controller = new CTRL(this._host);
    });
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
                event-name={action}
                label={action} />
        });

        return (
            <psk-container id="actions">
                {actions}
            </psk-container>
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
    @Prop() controllerName?: string = "FormController";

    @TableOfContentProperty({
        description: [`By defining this attribute, the user is able to control the behaviour of the form, so by definition, this attribute holds the possible actions inside the form, the defined actions should be sepparated by comma(",").`,
            `Also, as a recommendation, the values should be provided using lowercases, and if there are more words inside an action, to be written using dash symbol(-)`,
            `Example of form actions: submit, reset-form, validate-form, cancel`,
            `Using all these actions, the component will generate a <psk-link page="web-components/psk-button">psk-button</psk-link>.`],
        isMandatory: false,
        propertyType: 'string values sepparated by comma (,)',
        defaultValue: "submit",
        specialNote: "If this attribute has no value, then the submit form action is assumed as default value."
    })
    @Prop() formActions?: string | null = 'submit';

    @TableOfContentProperty({
        description: [`	Specifies where to send the form-data when a form is submitted`,
            `Most of the time, this is the URL to a server which is mainly responsible to handle the form-data.`],
        isMandatory: false,
        propertyType: 'string',
        defaultValue: "null",
        specialNote: "If this attribute has no value, then the current page will be handled. If a controller is given to the form, rather than FormController, then nothing will happen."
    })
    @Prop() action?: string | null = null;

    @TableOfContentProperty({
        description: [`This property specifies the HTTP method to use when sending form-data.`,
            `The possible values are <strong>get</strong> and <strong>post</strong>. If no value is provided, the GET is assumed.`],
        isMandatory: false,
        propertyType: 'string (get / post)',
        defaultValue: "get"
    })
    @Prop() method: string | null = 'get';

    @Element() private _host: HTMLElement;
}
