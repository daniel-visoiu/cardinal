import PskBindableModel from "./lib/bindableModel.js";
import ModalController from "./ModalController.js";

export default class ContainerController extends ModalController{

  constructor(element) {
    super(element);

    let __initGetModelEventListener = () => {
      element.addEventListener("getModelEvent", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        let {
          bindValue,
          callback
        } = e.detail;

        if (typeof callback === "function") {
          if (bindValue && this.model[bindValue]) {
            return callback(null, this.model[bindValue])
          }

          if (!bindValue) {
            return callback(null, this.model);
          }
        }
        callback(new Error("No callback provided"));
      });
    };

    this.element = element;
    this.setModel = PskBindableModel.setModel;

    __initGetModelEventListener();
  }

  //TODO refactor on, off, send methods. extract a validation function vor arguments check
  on(eventName, htmlElement, callback, options) {
    if (typeof htmlElement === "function") {
      options = callback;
      callback = htmlElement;
      htmlElement = null;
    }

    if (
      !eventName ||
      eventName.trim().length === 0 ||
      !callback ||
      typeof callback !== "function" ||
      !this.element ||
      !this.element.addEventListener
    ) {
      throw new Error("Invalid arguments");
    }

    if (htmlElement) {
      return htmlElement.addEventListener(eventName, callback, options);
    }

    this.element.addEventListener(eventName, callback, options);
  }

  off(eventName, htmlElement, callback, options) {
    if (typeof htmlElement === "function") {
      options = callback;
      callback = htmlElement;
      htmlElement = null;
    }

    if (
      !eventName ||
      eventName.trim().length === 0 ||
      !callback ||
      typeof callback !== "function" ||
      !this.element ||
      !this.element.removeEventListener
    ) {
      throw new Error("Invalid arguments");
    }

    if (htmlElement) {
      return htmlElement.removeEventListener(eventName, callback, options);
    }

    this.element.removeEventListener(eventName, callback, options);
  }

  send(eventName, data, htmlElement) {
    if (
      !eventName ||
      eventName.trim().length === 0 ||
      !this.element ||
      !this.element ||
      !this.element.dispatchEvent
    ) {
      throw new Error("Invalid arguments");
    }

    let newEvent = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: data
    });

    if (htmlElement) {
      return htmlElement.dispatchEvent(newEvent);
    }

    this.element.dispatchEvent(newEvent);
  }

}
