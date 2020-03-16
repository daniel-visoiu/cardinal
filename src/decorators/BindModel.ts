import { getElement } from "@stencil/core";
import { ComponentInterface } from "@stencil/core/dist/declarations";
import { createCustomEvent } from "../utils/utils";
import {
  __assignProperties,
  __getModelEventCbk,
  changeModel,
  __isAbleToBeDisplayed
} from "../utils/bindModelUtils";

declare type BindInterface = (
  target: ComponentInterface,
  methodName: string
) => void;

export function BindModel(): BindInterface {
  return (proto: ComponentInterface) => {
    let { componentWillLoad } = proto;

    proto.componentWillLoad = function () {
      let self = this;
      let thisElement: HTMLElement = getElement(self);

      self["changeModel"] = changeModel;
      self["__assignProperties"] = __assignProperties;

      function getModel(resolver) {

        function modelReceived(err, model) {
          __getModelEventCbk.apply(self, [err, model, resolver])
        }

        createCustomEvent(
          "getModelEvent",
          {
            bubbles: true,
            composed: true,
            cancellable: true,
            detail: {
              callback: modelReceived
            }
          },
          true,
          thisElement
        );
      }

      if (!thisElement.isConnected) {
        return componentWillLoad && componentWillLoad.call(self)
      }

      let attributes = thisElement.getAttributeNames();

      let relateAttributes = attributes.filter(attr => {
        if (attr.toLowerCase() === "data-view-model") {
          return true;
        }

        if (attr.toLowerCase().includes("view-model")) {
          return true;
        }

        if (thisElement.getAttribute(attr).toLowerCase().startsWith("@")) {
          return true;
        }

        return false;
      });

      if (relateAttributes.length === 0) {
        return componentWillLoad && componentWillLoad.call(self)
      }

      return new Promise((resolve) => {

        let resolver = () => {
          resolve(componentWillLoad && componentWillLoad.call(self));
        };

        getModel(resolver);

      })
    };
  };
}
