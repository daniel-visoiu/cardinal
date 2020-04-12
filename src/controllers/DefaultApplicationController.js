import ApplicationController from "./base-controllers/ApplicationController.js";
import AppControllerUtils from "./AppControllerUtils.js";

const configUrl = "/app-config.json";


export default class DefaultApplicationController extends ApplicationController {

    constructor(element) {
        super(element);
        this.configIsLoaded = false;
        this.pendingRequests = [];

        this._getAppConfiguration(configUrl, (err, _configuration) => {
            let basePath;
            if (window && window.location && window.location.origin) {
                basePath = window.location.origin;
            } else {
                basePath = _configuration.baseUrl;
            }
            this.configuration = AppControllerUtils._prepareConfiguration(_configuration, basePath);
            this.configIsLoaded = true;
            while (this.pendingRequests.length) {
                let request = this.pendingRequests.pop();
                if (!this.configuration[request.configName]) {
                    throw new Error(`Config ${request.configName} was not provided`)
                }
                request.callback(null, this.configuration[request.configName]);
            }
        });

        element.addEventListener("needRoutes", this._provideConfig("routes"));
        element.addEventListener("needMenuItems", this._provideConfig("menu"));
        element.addEventListener("getUserInfo", this._provideConfig("profile"));
        element.addEventListener("showAppModal",this._showModal());
        element.addEventListener("getHistoryType", this._provideConfig("historyType"));
        element.addEventListener("validateUrl", (e) => {
            e.stopImmediatePropagation();
            let { sourceUrl, callback } = e.detail;
            if (callback && typeof callback === "function") {
                this._parseSourceUrl(sourceUrl, callback);
            } else {
                console.error("Callback was not properly provided!");
            }
        });
    }

    _provideConfig(configName) {
        return (e) => {
            e.stopImmediatePropagation();
            let callback = e.detail;

            if (callback && typeof callback === "function") {
                if (this.configIsLoaded) {
                    if (!this.configuration[configName]) {
                        throw new Error(`Config ${configName} was not provided`)
                    }
                    callback(null, this.configuration[configName]);
                } else {
                    this.pendingRequests.push({ configName: configName, callback: callback });
                }
            }
        }
    }

    _parseSourceUrl(sourceUrl, callback) {
        sourceUrl = sourceUrl.replace(/(\s+|-)/g, '').toLowerCase();
        let paths = sourceUrl.split("/");

        let root = this.configuration.pagesHierarchy;
        for (let i = 0; i < paths.length; i++) {
            if (!root[paths[i]]) {
                callback(`${sourceUrl} is not a valid path in the application!`);
                break;
            }

            const children = root[paths[i]].children;

            if (typeof children === 'object' && typeof children.items === 'object' && i !== paths.length) {
                root = children.items;
                continue;
            }
            callback(null, root[paths[i]].path)
        }
    }

    _getAppConfiguration(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => {
            if (xhr.status != 200) {
                callback(new Error(xhr.status.code));
            } else {
                let configuration = JSON.parse(xhr.responseText);
                callback(null, configuration)
            }
        };

        xhr.onerror = () => {
            callback(new Error("An error occurred"));
        };
        xhr.send();
    }

    _hideModal(modal,callback){

    }

    _showModal(e){

      let modalName = e.detail;
      let appModals = this.configuration[modalName];
      if (!appModals[modalName]) {
        return console.error(`Modal with name ${modalName} does not exists. Did you forgot to add it in app-config.json?`)
      }

      let modalUrl = appModals[modalName];


    }

    _constructModalElement(modalUrl){
      let modalComponent = document.createElement("psk-page-loader");
      modalComponent.setAttribute("page-url",modalUrl);
    }
}
