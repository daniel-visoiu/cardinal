import { getElement } from "@stencil/core";
import { ComponentInterface } from "@stencil/core/dist/declarations";

declare type CustomThemeInterface = (
  target: ComponentInterface,
  methodName: string
) => void;


export default function CustomTheme(): CustomThemeInterface {
  return (proto: ComponentInterface) => {

    const { componentWillLoad } = proto;

    proto.componentWillLoad = function () {
      const host = getElement(this);
      if (!host || !host.shadowRoot) {
        //current component does not have a shadow dom.
        return componentWillLoad && componentWillLoad.call(this);
      }
      else {
        // @ts-ignore
        if (typeof globalConfig !== "undefined" && typeof globalConfig.theme === "string") {
          let componentName = host.tagName.toLowerCase();
          return new Promise((resolve) => {

            // @ts-ignore
            let themeStylePath = "/themes/" + globalConfig.theme + "/components/" + componentName + "/" + componentName + ".css";
            var styleElement = document.createElement("link");
            styleElement.setAttribute("rel", "stylesheet");
            styleElement.setAttribute("href", themeStylePath);

            // @ts-ignore
            host.shadowRoot.prepend(styleElement);
            let styleWasLoaded = false;

            let checkIfShouldResolve = () => {
              if (!styleWasLoaded) {
                styleWasLoaded = true;
                resolve(componentWillLoad && componentWillLoad.call(this));
              }
            };

            styleElement.onload = checkIfShouldResolve;
            styleElement.onerror = () => {
              console.log(`File ${themeStylePath} was not found`);
              //we let the component to render anyway
              checkIfShouldResolve();
            };

            //don't block the UI
            setTimeout(() => {
              if (styleWasLoaded === false) {
                styleWasLoaded = true;
                resolve(componentWillLoad && componentWillLoad.call(this));
              }
            }, 500)
          })
        }
        else {
          console.error("Theme or globalConfig is not defind!");
        }
      }
    };
  };
}
