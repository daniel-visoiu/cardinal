import ModalDataEvent from "../../events/ModalDataEvent.js";

export default class ModalController {

  constructor(element) {
    this.element = element;
    this.modalsUrls = null;
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

  showModal(modalName, bindContextData, returnCallback) {

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
      this.__constructModalElement(appModalPath, bindContextData);


      let completeCallback = (...args) => {
        this.hideModal();
        returnCallback(...args);
      };

      this.element.addEventListener("bindModalData", (evt) => {
        evt.stopImmediatePropagation();
        let callback = evt.data.callback;
        callback(undefined, bindContextData, completeCallback);
      });

      this.element.addEventListener("closeModal", this.hideModal.bind(this));

    });
  }

  hideModal() {
    let modal = this.element.querySelector("psk-page-loader[data-type=modal]");
    if (modal) {
      modal.remove();
    }
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


  getBindData(callback) {
    let modalDataEvent = new ModalDataEvent("bindModalData", {callback: callback}, {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.element.dispatchEvent(modalDataEvent);
  }
}
