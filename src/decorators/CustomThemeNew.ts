/**
 * TODO check if this could be used for further development
 */

import { getElement } from "@stencil/core";
import { ComponentInterface } from "@stencil/core/dist/declarations";

declare type CustomThemeInterface = (
  target: ComponentInterface,
  methodName: string
) => void;

const regex =/@import.*?["']([^"']+)["'].*?;/g
let dependencies = {};
let imports = {};


function checkForInnerDependencies(referrer,styleStr){

  if(!imports[referrer]){
    imports[referrer] = new Promise((resolve, _)=>{

      if(regex.exec(styleStr)){
        styleStr.replace(regex, (match, depUrl) => {

          if (!dependencies[depUrl]) {
            dependencies[depUrl] = resolveDependency(depUrl);
          }

          dependencies[depUrl].then((content)=>{
            resolve(styleStr.replace(match, content));
          })
        });
      }

      else{
        resolve(styleStr);
      }
    })
  }

  return imports[referrer];

}


function resolveDependency(url) {
  return new Promise((resolve) => {
    fetch(url).then((raw) => {
      resolve(raw.text());
    })
  })
}

export default function CustomThemeNew(): CustomThemeInterface {
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
    };


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
            let parent = host.shadowRoot ? host.shadowRoot : host;

              if(!dependencies[themeStylePath]){
                dependencies[themeStylePath]  = new Promise((resolve)=>{
                  resolveDependency(themeStylePath).then((cssRaw)=>{
                    resolve(cssRaw)
                  })
                })
              }

            dependencies[themeStylePath].then((cssRaw)=>{
              checkForInnerDependencies(themeStylePath, cssRaw).then((data:string)=>{
                let styleElement = document.createElement("style");
                styleElement.innerHTML = data;
                parent.prepend(styleElement);
                resolve(componentWillLoad && componentWillLoad.call(this));
              })
            })

          })
        }
        else {
          console.error("Theme or globalConfig is not defined!");
        }
      }
    };
  };
}
