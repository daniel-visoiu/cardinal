import { getElement, ComponentInterface } from "@stencil/core";
import BoundedModel from "./BoundedModel";
import {normalizeModelChain} from "../utils/utilFunctions";

declare type BindInterface = (
  target: ComponentInterface,
  methodName: string
) => void;

export function BindModel(): BindInterface {
  return (proto: ComponentInterface) => {
    let { componentWillLoad} = proto;

    proto.componentWillLoad = function () {
      let componentInstance = this.__proto__;
      let self = this;

      let thisElement: HTMLElement = getElement(self);

      function getModel(resolver, properties) {

        function modelReceived(err, model) {
          if(err){
            console.error(err);
          }

          /**
           * if view-model is defined, construct the property dictionary but do not overwrite existed
           * properties
           */
          if(thisElement.hasAttribute("view-model")){
            let modelChain = thisElement.getAttribute("view-model");
            modelChain = normalizeModelChain(modelChain);
            let propertiesData = model.getChainValue(modelChain);

            for(let prop in propertiesData){
              if (!properties[prop]) {
                properties[prop] = modelChain+"."+prop;
              }
            }
          }

          let boundedProperties = {};

          for(let prop in properties){
            let propViewModel = new BoundedModel(self, model);
            boundedProperties[prop] = propViewModel.createBoundedModel(prop, properties[prop]);
          }

          self.updateModelValue = function(prop, value){
              if(properties[prop]){
                boundedProperties[prop].updateModel(value);
              }
          };

          resolver();

        }

        thisElement.dispatchEvent(new CustomEvent("getModelEvent", {
          bubbles:true,
          composed:true,
          detail: {callback: modelReceived}
        }))

      }

      if (!thisElement.isConnected) {
        return componentWillLoad && componentWillLoad.call(self)
      }

      let componentProperties = Object.keys(componentInstance);
      let propsDictionary = {};

      for (let i = 0; i < componentProperties.length; i++) {
        let prop = componentProperties[i];
        if (this[prop] !== null && typeof this[prop] === "string" && this[prop].startsWith("@")) {
          propsDictionary[prop] = this[prop];
        }
      }

      let hasViewModel = thisElement.hasAttribute("view-model");
      if (Object.keys(propsDictionary).length === 0 && !hasViewModel) {
           return componentWillLoad && componentWillLoad.call(self)
      }

      return new Promise((resolve) => {

        let resolver = () => {
          resolve(componentWillLoad && componentWillLoad.call(self));
        };
        getModel(resolver, propsDictionary);

      })
    };
  };
}
