import {getElement} from "@stencil/core";
import {ComponentInterface} from "@stencil/core/dist/declarations";

declare type CustomThemeInterface = (
  target: ComponentInterface,
  methodName: string
) => void;

const regex = /@import.*?["']([^"']+)["'].*?;/g
let dependencies = {};
let imports = {};
let appTheme;

function checkForInnerDependencies(referrer, styleStr) {

  if (!imports[referrer]) {
    imports[referrer] = new Promise((resolve, reject) => {

      if (regex.exec(styleStr)) {
        styleStr.replace(regex, (match, depUrl) => {

          if (!dependencies[depUrl]) {
            dependencies[depUrl] = resolveDependency(depUrl);
          }

          dependencies[depUrl].then((content) => {
            resolve(styleStr.replace(match, content));
          }).catch(reject)
        });
      }

      else {
        resolve(styleStr);
      }
    })
  }

  return imports[referrer];

}

function resolveDependency(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then((response) => {
      if (response.ok) {
        return resolve(response.text());
      }
      reject({url: response.url, status: response.status, statusText: response.statusText});
    })
  })
}

export default function CustomTheme(): CustomThemeInterface {
  return (proto: ComponentInterface) => {

    const {componentWillLoad} = proto;
    proto.getInnerContent = function (htmlElementProperty) {
      const host = getElement(this);
      if (host[htmlElementProperty]) {

        let styleElement = host.querySelector('style');
        if (styleElement) {
          let content = host[htmlElementProperty].replace(styleElement.outerHTML, "");
          host[htmlElementProperty] = styleElement.outerHTML;
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

        let injectThemeStyle = (theme) => {
          let componentName = host.tagName.toLowerCase();
          return new Promise((resolve) => {
            // @ts-ignore
            let themeStylePath = "/themes/" + theme + "/components/" + componentName + "/" + componentName + ".css";
            let parent = host.shadowRoot ? host.shadowRoot : host;

            if (!dependencies[themeStylePath]) {
              dependencies[themeStylePath] = new Promise((resolve, reject) => {
                resolveDependency(themeStylePath).then((cssRaw) => {
                  resolve(cssRaw)
                }).catch(reject);
              })
            }

            dependencies[themeStylePath].then((cssRaw) => {
              checkForInnerDependencies(themeStylePath, cssRaw).then((data: string) => {
                let styleElement = document.createElement("style");
                styleElement.innerHTML = data;
                parent.prepend(styleElement);
              })
            }).catch((errorStatus) => {
              console.log(`Request on resource ${errorStatus.url} ended with status: ${errorStatus.status} (${errorStatus.statusText})`);
            }).finally(() => {
              resolve(componentWillLoad && componentWillLoad.call(this));
            })

          })
        };

        if (!appTheme) {
          return new Promise((resolve)=>{
            let event = new CustomEvent("getThemeConfig", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: (err, theme) => {
                if (err) {
                  return console.log(err);
                }
                appTheme = theme;
                injectThemeStyle(appTheme).then(()=>{
                  resolve();
                });
              }
            });

            host.dispatchEvent(event);
          });
        }
        else{
          return injectThemeStyle(appTheme);
        }
      }
    };
  };
}
