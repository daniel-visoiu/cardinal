import {getElement} from "@stencil/core";
import {ComponentInterface} from "@stencil/core/dist/declarations";
import {BUILD} from "@stencil/core/build-conditionals";

declare type MyDecoratorResult = (
  target: ComponentInterface,
  methodName: string
) => void;

declare interface CustomThemeOptions {
  // some optional decorator parameters go here
}

export default function CustomTheme(opt?: CustomThemeOptions): MyDecoratorResult {
  return (proto: ComponentInterface) => {
    // this is to resolve the 'compiler optimization issue':
    // lifecycle events not being called when not explicitly declared in at least one of components from bundle
    BUILD.cmpDidLoad = true;
    BUILD.cmpDidUnload = true;
    console.log(opt);
    const {componentDidLoad, componentDidUnload} = proto;

    proto.componentDidLoad = function () {
      const host = getElement(this);
      let componentName = this.el.localName;
      // @ts-ignore
      if (typeof globalConfig !== "undefined" && typeof globalConfig.theme === "string") {
        // @ts-ignore
        let themeStylePath = "/assets/themes/"+globalConfig.theme+"/components/" + componentName + "/" + componentName + ".css";
        var styleElement = document.createElement("link");
        styleElement.setAttribute("rel", "stylesheet");
        styleElement.setAttribute("href", themeStylePath);
        console.log(host.shadowRoot);
        host.shadowRoot.appendChild(styleElement);
      }

      return componentDidLoad && componentDidLoad.call(this);
    };

    proto.componentDidUnload = function () {

      //const host = getElement(this);
      //const method = this[methodName];
      // Your decorating code goes here. Cleanup!
      return componentDidUnload && componentDidUnload.call(this);
    };
  };
}
