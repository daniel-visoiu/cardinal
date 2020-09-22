import {Component, h, Prop, Element, State} from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme';
import ControllerRegistryService from "../../../services/ControllerRegistryService";
import {TableOfContentProperty} from '../../../decorators/TableOfContentProperty';
import {injectHistory, RouterHistory} from "@stencil/router";

@Component({
  tag: 'psk-form',
  styleUrls: [
    "../../../assets/fonts/font-awesome/font-awesome.min.css",
    "../../../assets/css/bootstrap/bootstrap.min.css"]
})
export class PskForm {

  @CustomTheme()

  @State() controller: any | null;
  @State() disconnected: boolean | false;

  @Prop() history: RouterHistory;

  connectedCallback() {
    this.disconnected = false;
  }

  disconnectedCallback() {
    this.disconnected = true;
  }

  promisifyControllerLoad = (controllerName) => {
    return new Promise((resolve, reject) => {
      ControllerRegistryService.getController(controllerName).then((controller) => {
        // Prevent javascript execution if the node has been removed from DOM
        resolve(controller);
      }).catch(reject);
    })
  };

  componentWillLoad(): Promise<any> {
    if (typeof this.controllerName === "string") {
      let promise;
      promise = this.promisifyControllerLoad(this.controllerName);
      promise.then((Controller) => {
        if (!this.disconnected) {
          this.controller = new Controller(this._host, this.history);
        }

      }).catch((err) => {
        console.log(err);
      });
      return promise;
    }
  }

  submitForm(event){

    event.preventDefault();
    event.stopImmediatePropagation();

    let submitter = event.submitter;
    let eventName = submitter.getAttribute("value");

    this._host.dispatchEvent( new CustomEvent(eventName,{
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }

  render() {

    return (
      <div class="container">
        <form onSubmit={this.submitForm.bind(this)} >
          <slot/>
          {this._createFormButtons(this.formActions)}
        </form>
      </div>
    );
  }

  _createFormButtons(formActions: string): HTMLElement {
    if (formActions.trim().length === 0) {
      return null;
    }

    let formActionsArray = formActions.split(",").map(action => action.trim());
    let formButtons = formActionsArray.map((action: string) => {

    let buttonType = action.toLowerCase() === "reset" ? "reset" : "submit";
    let className = action.toLowerCase().replace(/\s/g, "-");

    return(
      <button type={buttonType} class={`${className} btn btn-primary`} value={action}>
        {action}
      </button>)
    });

    return (
      <div id="actions" class="container-fluid">
        {formButtons}
      </div>
    );
  }

  @TableOfContentProperty({
    description: ['This attributes is setting the controller of the form.',
      'Information about creating a controller can be found inside the documentation: <psk-link tag="mvc-controller">Controllers Documentation</psk-link>'],
    isMandatory: false,
    propertyType: 'string',
    defaultValue: "null",
    specialNote: "If the controller name is not provided, the events will bubble to the parent elements until them will be stopped by an existing handler."
  })
  @Prop() controllerName: string | null;

  @TableOfContentProperty({
    description: [`By defining this attribute, the user is able to control the behaviour of the form, so by definition, this attribute holds the possible actions inside the form. The defined actions should be separated by comma(",").`,
      `All actions except <code>reset</code> will perform a native form validation first. After form validation succeed, then an event with the same name as the action will be triggered.`,
      `<i>Example of form actions: submit, reset, validate, cancel;</i>`,
      `Please bear in mind that your controller catches the <code>reset event</code> and then the form fields will be cleared. If you want to change this behavior, don't forget to stop the propagation of the event.`,
      `If this attribute is not defined, you can also add <psk-link tag="psk-button">psk-button</psk-link> components anywhere in the form. Because the <code>psk-button</code> is not able to generate trusted events, a <psk-link tag="psk-button" chapter="type">type="submit"</psk-link> attribute is necessary.` ],
    isMandatory: false,
    propertyType: 'string values separated by comma (,)',
    defaultValue: "null",
    specialNote: ["If this attribute has no value, then the form will have no actions."]
  })
  @Prop() formActions?: string | null = '';

  @Element() private _host: HTMLElement;
}

injectHistory(PskForm);
