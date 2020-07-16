import {Component, h, Prop, Element, State} from "@stencil/core";
import ControllerRegistryService from "../../services/ControllerRegistryService";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";
import DefaultContainerController from "../../controllers/base-controllers/ContainerController.js";
import {injectHistory, RouterHistory} from "@stencil/router";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: "psk-container"
})
export class PskContainer {
  @CustomTheme()
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
  @State() disconnected: boolean | false;

  // Internal usage property. In the public documentation, this property should be mentioned as a feature in case the user wants to create a component and to provide the HTML context to the container.
  // This property is provided by other components where psk-container is loaded. (e.g. psk-form)
  // If this property is filled in, the searching of a controller script will commence here.

  @Prop() history: RouterHistory;

  @Element() private _host: HTMLElement;

  connectedCallback() {
    this.disconnected = false;
  }
  disconnectedCallback() {
    this.disconnected = true;
  }

  render() {
    return [
      <slot/>,
      this.htmlFilePath && <psk-page-loader pageUrl={this.htmlFilePath}/>
    ];
  }

  promisifyControllerLoad = (controllerName) => {
    return new Promise((resolve, reject) => {
      ControllerRegistryService.getController(controllerName).then((controller) => {
        // Prevent javascript execution if the node has been removed from DOM
        resolve(controller);
      }).catch(reject);
    })
  };

  componentWillLoad() {
    let promise;
    if (typeof this.controllerName === "string" && this.controllerName.length > 0) {
       promise = this.promisifyControllerLoad(this.controllerName);
    }else{
       promise = Promise.resolve(DefaultContainerController);
    }

    promise.then((Controller)=>{
      if (!this.disconnected) {
        this.controller = new Controller(this._host, this.history);
        this.__getInnerController.call(this, this._host);

        if(this.controllerScript){
          this.executeScript(this.controllerScript);
        }
      }

    }).catch((err)=>{
      console.log(err);
    });

    return promise;

  }

  __getInnerController(fromElement: HTMLElement): void {
    const children:HTMLCollection = fromElement.children;
    // Find only the first direct <script> descendant
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.tagName.toLowerCase() !== 'script') {
            continue;
        }

        this.controllerScript = child.innerHTML;
        child.innerHTML = '';
        return;
    }
  }

  executeScript(script) {
    if (typeof script === 'string' && script.trim().length > 0) {
      new Function('controller', script)(this.controller);
    }
    return null;
  }

}
injectHistory (PskContainer);
