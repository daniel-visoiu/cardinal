class ControllerRegistryService {
    constructor() {
        this.controllers = {};
        this.pendingControllerRequests = {}
    }

    registerController(controllerName, controller) {
        this.controllers[controllerName] = controller;
        this._fullFillPreviousRequests(controllerName);
    }

    _fullFillPreviousRequests(controllerName) {
        if (this.pendingControllerRequests[controllerName]) {
            while (this.pendingControllerRequests[controllerName].length) {
                let request = this.pendingControllerRequests[controllerName].pop();
                request.resolve(this.controllers[controllerName]);
            }
        }
    }

    getController(controllerName) {
        let controllerPromise = new Promise((resolve, reject) => {

            if (this.controllers[controllerName]) {
                resolve(this.controllers[controllerName]);
            } else {
                let resourcePath = `scripts/controllers/${controllerName}.js`;
                if(typeof window.basePath !== "undefined"){
                    let sep = "/";
                    if(window.basePath[window.basePath.length-1] ===sep){
                        sep = "";
                    }
                    resourcePath = window.basePath+sep+resourcePath;
                }
                import (resourcePath)
                .then((module) => {
                    resolve(module.default || module);
                }).catch(reject);
            }
        });

        return controllerPromise;
    }
}

export default new ControllerRegistryService();
