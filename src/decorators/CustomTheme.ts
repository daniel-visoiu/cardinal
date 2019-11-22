import { getElement } from "@stencil/core";
import { ComponentInterface } from "@stencil/core/dist/declarations";

declare type CustomThemeInterface = (
  target: ComponentInterface,
  methodName: string
) => void;


export default function CustomTheme(): CustomThemeInterface {
  return (proto: ComponentInterface) => {

    const { componentWillLoad } = proto;
    proto.getInnerContent = function (htmlElementProperty) {
      const host = getElement(this);
      if (host[htmlElementProperty]) {

        let linkElement = host.querySelector('link')
        if (linkElement) {
          let content = host[htmlElementProperty].replace(linkElement.outerHTML, "");
          host[htmlElementProperty] = linkElement.outerHTML;
          return content;
        }
        return host[htmlElementProperty];
      } else {
        console.error(`${htmlElementProperty} is not a property`);
      }
    }

    
    proto.componentWillLoad = function () {
      const host = getElement(this);

      if (!host) {
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

            let parent = host.shadowRoot ? host.shadowRoot : host;
            // @ts-ignore
            parent.prepend(styleElement);

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
            }, 100)
          })
        }
        else {
          console.error("Theme or globalConfig is not defind!");
        }
      }
    };
  };
}
