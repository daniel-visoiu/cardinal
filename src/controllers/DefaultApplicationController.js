import AppConfigurationHelper from "./AppConfigurationHelper.js";
import defaultApplicationConfig from "./defaultApplicationConfig.json";
const configUrl = "/app-config.json";
window.globalConfig = {};
export default class DefaultApplicationController  {

    constructor(element) {
        this.configIsLoaded = false;
        this.pendingRequests = [];

        this._getAppConfiguration(configUrl, (err, _configuration) => {
            let basePath;
            if (window && window.location && window.location.origin) {
                basePath = window.location.origin;
            } else {
                basePath = _configuration.baseUrl;
            }
            this.configuration = AppConfigurationHelper._prepareConfiguration(_configuration, basePath);
            this.configuration.theme = _configuration.theme;
            this.configuration.appVersion = _configuration.appVersion;

            this.configIsLoaded = true;
            while (this.pendingRequests.length) {
                let request = this.pendingRequests.pop();
                if (!this.configuration[request.configName]) {
                    throw new Error(`Config ${request.configName} was not provided. Did you set it in app-config.json?`)
                }
                request.callback(undefined, this.configuration[request.configName]);
            }
        });

        element.addEventListener("getThemeConfig", this._provideConfig("theme"));
        element.addEventListener("getAppVersion", this._provideConfig("appVersion"));
        element.addEventListener("needRoutes", this._provideConfig("routes"));
        element.addEventListener("needMenuItems", this._provideConfig("menu"));
        element.addEventListener("getUserInfo", this._provideConfig("profile"));
        element.addEventListener("getHistoryType", this._provideConfig("historyType"));
        element.addEventListener("getModals", this._provideConfig("modals"));
        element.addEventListener("getTags", this._provideConfig("tags"));
        element.addEventListener("validateUrl", (e) => {
              e.stopImmediatePropagation();
              let { sourceUrl, callback } = e.detail;
              if (callback && typeof callback === "function") {
                  this._parseSourceUrl(sourceUrl, callback);
              } else {
                  console.error("Callback was not properly provided!");
              }
          });


        //this should be added in a SSApp lifecycle mechanism
         element.addEventListener("getCustomLandingPage",(e)=>{

           let callback = e.detail;
           if (window.frameElement) {
             if(window.frameElement.hasAttribute("landing-page")){
               let landingPage = window.frameElement.getAttribute("landing-page");
               return callback(undefined, landingPage);
             }
           }
           callback();
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
                    callback(undefined, this.configuration[configName]);
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
            let segment = paths[i];

            const segmentInsideMenu = Object.keys(root).find(function(key) {
                return root[key].path.toLowerCase().indexOf(segment) !== -1;
            });

            let isSegmentInsideMenu = typeof root[segmentInsideMenu] !== 'undefined';

            if (!root[segment] && !isSegmentInsideMenu) {
                callback(`${sourceUrl} is not a valid path in the application!`);
                break;
            }

            let children;
            if(isSegmentInsideMenu) {
                children = root[segmentInsideMenu].children;
            } else {
                children = root[segment].children;
            }

            if (typeof children === 'object' && typeof children.items === 'object' && i !== paths.length) {
                root = children.items;
                continue;
            }

            let linkPath;
            if(isSegmentInsideMenu) {
                linkPath = root[segmentInsideMenu].path;
            } else {
                linkPath = root[segment].path;
            }

            return callback(undefined, linkPath);
        }
    }

    _getAppConfiguration(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => {
            if (xhr.status != 200) {
                console.error("Configuration file app-config.json was not found!");
                callback(null, defaultApplicationConfig);

            } else {
                let customConfiguration = JSON.parse(xhr.responseText);

              for (let i in defaultApplicationConfig) {
                if (!customConfiguration.hasOwnProperty(i)) {
                  customConfiguration[i] = defaultApplicationConfig[i];
                }
              }
                callback(null, customConfiguration)
            }
        };

        xhr.onerror = () => {
            callback(new Error("An error occurred"));
        };
        xhr.send();
    }
}
