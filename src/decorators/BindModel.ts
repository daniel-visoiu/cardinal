import {getElement, ComponentInterface} from "@stencil/core";
import {dashToCamelCase, normalizeModelChain} from "../utils/utilFunctions";
const ATTRIBUTE = "attr";
const PROPERTY = "prop";

function hasChainSignature(property) {
  if (property === null || typeof property !== "string") {
    return false;
  }
  if (!property.startsWith("@")) {
    return false;
  }
  return property.length >= 2;
}

function attributeHasValidChain(attr, attrValue, properties) {
  if (!hasChainSignature(attrValue)){
    return false;
  }

  if(typeof properties[attr] !== "undefined"){
    return false;
  }

  if(typeof dashToCamelCase(attrValue) !== "undefined"){
    return false;
  }

  return attr !== "view-model";

}

function getUpdateHandler(type, model){

  switch (type) {
    case ATTRIBUTE:
      return function (attr, boundedChain){
        this.setAttribute(attr, model.getChainValue(boundedChain))
      };
    default:
      return function (property, boundedChain){
        this[property] = model.getChainValue(boundedChain);
      };
  }
}

function BoundedModel(updateHandler, model) {

  this.createBoundedModel = function (property, boundedChain) {

    boundedChain = normalizeModelChain(boundedChain);

    model.onChange(boundedChain, ()=>{
      updateHandler(property, boundedChain);
    });

    updateHandler(property, boundedChain);

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
          properties[prop] = {
            value:modelChain + "." + prop,
            type:PROPERTY
          };
        }
      }
    }

    let boundedProperties = {};

    for (let prop in properties) {
      let instance = properties[prop].type === ATTRIBUTE ? element : this;
      let handler = getUpdateHandler.call(instance, properties[prop].type, model);
      let propViewModel = new BoundedModel(handler.bind(instance), model);
      boundedProperties[prop] = propViewModel.createBoundedModel(prop, properties[prop].value);
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
        let elementAttributes = element.getAttributeNames();
        let properties = {};

        /**
         * iterate through component properties and search for model chains
         */
        for (let i = 0; i < componentProperties.length; i++) {
          let prop = componentProperties[i];
          if (hasChainSignature(this[prop])) {
            properties[prop] = {
              value: this[prop],
              type: PROPERTY
            }
          }
        }

        /**
         * iterate through component attributes and search for model chains
         */
        for (let i = 0; i < elementAttributes.length; i++) {
          let attr = elementAttributes[i];
          let attrValue = element.getAttribute(attr);
          if (attributeHasValidChain(attr, attrValue, properties)) {
            properties[attr] = {
              value: attrValue,
              type: ATTRIBUTE
            };
          }
        }

        /**
         * check for existing view-model attribute
         */
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
