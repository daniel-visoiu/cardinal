class ControllerFactory {
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

        import(`/scripts/controllers/${controllerName}.js`)
          .then((module) => {
            resolve(module.default||module);
          }).catch(error=>{
            throw error;
        });

        // if (!this.pendingControllerRequests[controllerName]) {
        //   this.pendingControllerRequests[controllerName] = [];
        // }
        // this.pendingControllerRequests[controllerName].push({resolve, reject});
      }
    });

    return controllerPromise;

  }

}

export default new ControllerFactory();
