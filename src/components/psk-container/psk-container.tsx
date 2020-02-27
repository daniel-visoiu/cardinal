import {Component, h, Prop, Element, State} from "@stencil/core";
import ControllerRegistryService from "../../services/ControllerRegistryService";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";

const BINDABLE_CONTROLLER_PATH = "base-controllers/BindableController";

@Component({
  tag: "psk-container"
})
export class PskContainer {
  @TableOfContentProperty({
    isMandatory: false,
    description: [`This property is a string that will permit the developer to choose his own controller.`,
      `If no value is sent then the null default value will be taken and the component will use the basic Controller.`],
    propertyType: `string`,
    defaultValue: `null`
  })
  @Prop() controllerName?: string | null;

  @TableOfContentProperty({
    description: [`This property is the page url (html) that will be passed to the psk-page-loader component`,
      `This component will sent a get request to that url in order to get the content of that url.`],
    isMandatory: false,
    propertyType: `string`,
    defaultValue: `null`
  })
  @Prop() htmlFilePath?: string | null;
  @Prop() parentCallback: Function | null;

  @State() controller: any | null;
  @State() innerHtml: string | null;
  @State() controllerScript: string | null;

  // Internal ussage property. In the public documentation, this property should be mentioned as a feature in case the user wants to create a component and to provide the HTML context to the container.
  // This property is provided by other components where psk-container is loaded. (e.g. psk-form)
  // If this property is filled in, the searching of a controller script will commence here.


  @Element() private _host: HTMLElement;


  render() {
    return [
      <slot/>,
      this.htmlFilePath && <psk-page-loader pageUrl={this.htmlFilePath}/>,
      (this.controller && this.controllerScript) && this.controller.executeScript(this.controller, this.controllerScript)
    ];
  }

  promisifyControllerLoad = (controllerName) => {
    return new Promise((resolve, reject) => {
      ControllerRegistryService.getController(controllerName).then((CTRL) => {
        this.controller = new CTRL(this._host);
        this.__getInnerController.call(this, this._host);
        resolve();
      }).catch(reject);

    })
  };

  componentWillLoad() {
    if (typeof this.controllerName === "string" && this.controllerName.length > 0) {
      return this.promisifyControllerLoad(this.controllerName);
    }
    return this.promisifyControllerLoad(BINDABLE_CONTROLLER_PATH);
  }

  __getInnerController(fromElement: HTMLElement): void {
    let scriptInnerHtml: HTMLElement = fromElement.querySelector("script");

    if (scriptInnerHtml !== null) {
      this.controllerScript = scriptInnerHtml.innerHTML;
      scriptInnerHtml.innerHTML = "";
    }
  }
}
