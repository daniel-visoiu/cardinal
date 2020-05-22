import PskBindableModel from "./lib/bindableModel.js";
import DSUStorage from "./lib/DSUStorage.js";

export default class ContainerController {

  constructor(element) {
    let modelRequests = [];

    let dispatchModel = function (bindValue, model, callback) {
      if (bindValue && model[bindValue]) {
         callback(null, model[bindValue])
      }

      if (!bindValue) {
         callback(null, model);
      }
    };

    let __initGetModelEventListener = () => {
      element.addEventListener("getModelEvent", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        let {
          bindValue,
          callback
        } = e.detail;

        if (typeof callback === "function") {

          if (!this.model) {
            modelRequests.push(
              {bindValue: bindValue, callback: callback}
            );
            return;
          }

          return dispatchModel(bindValue, this.model, callback)

        }
        callback(new Error("No callback provided"));
      });
    };

    this.element = element;
    this.DSUStorage = new DSUStorage();
    this.setModel = (model) => {
      this.model = PskBindableModel.setModel(model);

      while (modelRequests.length > 0) {
        let modelRequest = modelRequests.pop();
        let {bindValue, callback} = modelRequest;
        dispatchModel(bindValue, this.model, callback)
      }

      return this.model;
    };
    this.modalsUrls = null;

    __initGetModelEventListener();
  }

  /**
   * This method is registering a function that will be executed when an event is triggered.
   * @param {string} eventName - The name of the event
   * @param {Function} listener - The function that will be executed when he event is triggered
   * @param {null | boolean | Object} options - The options for the listener. Full options documentation can be found at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @throws {string} - error in case any argument is invalid
   */
  on(eventName, listener, options) {
    try {
      this._checkArguments(eventName, listener, options);
      this.element.addEventListener(eventName, listener, options);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This method removes a registered event, so the registered function will not be executed anymore.
   * The important notice is that the event which will be unregistered must have the same arguments as the registered event, otherwise it will not be removed.
   * @param {string} eventName - The name of the event
   * @param {Function} listener - The function that will be executed when he event is triggered
   * @param {null | boolean | Object} options - The options for the listener. Full options documentation can be found at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @throws {string} - error in case any argument is invalid
   */
  off(eventName, listener, options) {
    try {
      this._checkArguments(eventName, listener, options);
      this.element.removeEventListener(eventName, listener, options);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This creates a custom event and then is dispatched.
   * @param {string} eventName - The name of the event
   * @param {any | null} data - The data to be sent with the event. This argument can be empty or null.
   * @param {Object | null} options - The options that will be set to the event (bubbles, cancelable, composed...). Full list of options can be found here: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
   */
  send(eventName, data, options) {
    if (!options) {
      options = {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: data
      };
    }

    if (!eventName || eventName.trim().length === 0) {
      throw new Error(`
      Argument eventName is not valid. It must bea non-empty string.
      Provided value: ${eventName}
      `);
    }

    this.element.dispatchEvent(new CustomEvent(eventName, options));
  }

  showModal(modalName, bindContextData, returnCallback) {

    const completeCallback = (...args) => {
      this.hideModal();
      console.log('Hide modal is called from completecalback');
      returnCallback(...args);
    };

    const bindModalDataHandler = function (evt) {
      let callback = evt.data.callback;
      callback(undefined, bindContextData, completeCallback);
    }

    this.__getModalsUrl((err, modalsUrls) => {
      if (err) {
        throw err;
      }

      if (!modalsUrls) {
        throw new Error("Modals is not configured for this app");
      }

      let appModalPath = modalsUrls[modalName];
      if (!appModalPath) {
        return console.error(`Modal with name ${modalName} does not exists. Did you forgot to add it in app-config.json?`)
      }
      this.__constructModalElement(appModalPath);

      this.element.addEventListener("bindModalData", bindModalDataHandler);
      this.element.addEventListener("closeModal", this.hideModal.bind(this, bindModalDataHandler));
    });
  }

  hideModal(eventHandlerToRemove) {
    let modal = this.element.querySelector("psk-page-loader[data-type=modal]");
    if (modal) {
      modal.remove();
    }

    if (eventHandlerToRemove) {
      this.element.removeEventListener('bindModalData', eventHandlerToRemove);
    }
  }

  /**
   * This function validates the arguments for on and off methods
   * @param {string} eventName - The name of the event
   * @param {Function} listener - The function that will be executed when he event is triggered
   * @param {null | boolean | Object} options - The options for the listener.
   * @throws {string} - error in case any argument is invalid
   */
  _checkArguments(eventName, listener, options) {
    if (typeof eventName !== 'string' || eventName.trim().length === 0) {
      throw new Error(`
      Argument eventName is not valid. It must be a non-empty string.
      Provided value: ${eventName}
      `);
    }

    if (typeof listener !== 'function') {
      throw new Error(`
      Argument listener is not valid, it must be a function.
      Provided value: ${listener}
      `);
    }

    if (options && typeof options !== 'boolean' && typeof options !== 'object') {
      throw new Error(`
      Argument options is not valid, it must a boolean (true/false) in case of capture, or an options object.
      If no options are needed, this argument can be left empty.
      Provided value: ${options}
      `);
    }
  }

  __getModalsUrl(callback) {

    if (this.modalsUrls) {
      return callback(this.modalsUrls)
    }

    let event = new CustomEvent("getModals", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: callback
    });

    this.element.dispatchEvent(event);
  }

  __constructModalElement(modalUrl) {
    let modal = this.element.querySelector("psk-page-loader[data-type=modal]");

    if (!modal) {
      modal = document.createElement("psk-page-loader");
      this.element.append(modal);
      modal.setAttribute("data-type", "modal");
    }
    modal.setAttribute("page-url", modalUrl);
  }

}
