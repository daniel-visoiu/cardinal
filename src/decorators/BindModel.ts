import {getElement, ComponentInterface} from "@stencil/core";
import {normalizeModelChain} from "../utils/utilFunctions";

function isValidProperty(property) {
  if (property === null || typeof property !== "string") {
    return false;
  }
  if (!property.startsWith("@")) {
    return false;
  }
  return property.length >= 2;
}


function BoundedModel(componentInstance, model) {

  this.createBoundedModel = function (property, boundedChain) {

    boundedChain = normalizeModelChain(boundedChain);

    function updateView() {
      componentInstance[property] = model.getChainValue(boundedChain);
    }

    model.onChange(boundedChain, updateView);
    updateView();

    return {
      updateModel: (value) => {
        model.setChainValue(boundedChain, value);
      }
    }
  }
}

function bindComponentProps(element, propsData, callback) {

  let {properties, hasViewModel, instanceName} = propsData;

  let modelReceived = (err, model) => {
    if (err) {
      console.error(err);
    }

    /**
     * if view-model is defined, construct the property dictionary but do not overwrite existing
     * properties
     */
    if (hasViewModel) {
      let modelChain = element.getAttribute("view-model");
      modelChain = normalizeModelChain(modelChain);
      let propertiesData = model.getChainValue(modelChain);

      for (let prop in propertiesData) {
        if (!properties[prop]) {
          properties[prop] = modelChain + "." + prop;
        }
      }
    }

    let boundedProperties = {};

    for (let prop in properties) {
      let propViewModel = new BoundedModel(this, model);
      boundedProperties[prop] = propViewModel.createBoundedModel(prop, properties[prop]);
    }

    if (typeof this[instanceName] !== "undefined") {
      throw new Error(`BindModel decorator received a wrong argument as instance name: [${instanceName}]`);
    }
    else {
      this[instanceName] = {
        updateModel: (prop, value) => {
          if (properties[prop]) {
            boundedProperties[prop].updateModel(value);
          }
        }
      };
    }
    callback();
  };

  element.dispatchEvent(new CustomEvent("getModelEvent", {
    bubbles: true,
    composed: true,
    detail: {callback: modelReceived}
  }))
}

export function BindModel() {
  return (proto: ComponentInterface, instanceName?) => {
    let {componentWillLoad} = proto;

    proto.componentWillLoad = function () {
      let componentInstance = this.__proto__;
      let self = this;
      let element: HTMLElement = getElement(self);

      let callComponentWillLoad = (promise?) => {
        if (!promise) {
          promise = Promise.resolve();
        }
        promise.then(() => {
          return componentWillLoad && componentWillLoad.call(self)
        });
        return promise;
      };

      if (element.isConnected) {
        let componentProperties = Object.keys(componentInstance);
        let properties = {};

        for (let i = 0; i < componentProperties.length; i++) {
          let prop = componentProperties[i];
          if (isValidProperty(this[prop])) {
            properties[prop] = this[prop];
          }
        }

        let hasViewModel = element.hasAttribute("view-model");
        if (Object.keys(properties).length > 0 || hasViewModel) {
          return callComponentWillLoad(new Promise((resolve) => {
            let propsData = {
              properties: properties,
              hasViewModel: hasViewModel,
              instanceName: instanceName
            };
            bindComponentProps.call(self, element, propsData, resolve);
          }))
        }
      }
      return callComponentWillLoad();
    };
  };
}
