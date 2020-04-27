import AppConfigurationHelper from "./AppConfigurationHelper.js";

const configUrl = "/app-config.json";

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
}
