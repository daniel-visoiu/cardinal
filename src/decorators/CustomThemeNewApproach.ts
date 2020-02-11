/**
 * TODO check if this could be used for further development
 */

import { getElement } from "@stencil/core";
import { ComponentInterface } from "@stencil/core/dist/declarations";

declare type CustomThemeInterface = (
  target: ComponentInterface,
  methodName: string
) => void;

let styleNodeElements = {};
let dependencies = {};

let regex =/@import.*?["']([^"']+)["'].*?;/g
function checkForInnerDependencies(url, styleStr){

  let baseUrl = url.substring(0,url.lastIndexOf("/")+1);


  return new Promise((resolve, _)=>{


    if(regex.exec(styleStr)){
      styleStr.replace(regex, (match, g1) => {
        let depUrl = baseUrl+g1;
        //console.log("URL",depUrl);
        if(dependencies[depUrl]){
          resolve(styleStr.replace(match,dependencies[depUrl]));
        }
        else{
          fetch(depUrl).then((raw)=>{
            return raw.text();
          }).then((data)=>{
            dependencies[depUrl] = data;
            resolve(styleStr.replace(match,dependencies[depUrl]));
          })
        }
      });
    }
    else{
      resolve(styleStr);
    }

  })
}

export default function CustomThemeNewApproach(): CustomThemeInterface {
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
            let parent = host.shadowRoot ? host.shadowRoot : host;

            //console.log(styleNodeElements);
            if(styleNodeElements[themeStylePath]){

              let styleElement = document.createElement("style");
              styleElement.innerText = styleNodeElements[themeStylePath];

              parent.prepend(styleElement);
              resolve(componentWillLoad && componentWillLoad.call(this))
            }

            else{



              fetch(themeStylePath).then(raw=>{
                return raw.text();
              }).then((cssRaw)=>{


                  checkForInnerDependencies(themeStylePath, cssRaw).then((data:string)=>{
                    let styleElement = document.createElement("style");
                    styleElement.innerText = data;
                    styleNodeElements[themeStylePath] = data;
                    parent.prepend(styleElement);

                  });
                resolve(componentWillLoad && componentWillLoad.call(this));

              });
            }

          })
        }
        else {
          console.error("Theme or globalConfig is not defined!");
        }
      }
    };
  };
}
