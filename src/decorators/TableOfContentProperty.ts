import * as d from "./declarations/declarations";
import { DEFINED_PROPERTIES, DATA_DEFINED_PROPS } from "../utils/constants";
import { getElement } from "@stencil/core";
import { createCustomEvent, normalizeCamelCaseToDashed } from "../utils/utilFunctions";

export function TableOfContentProperty(opts: d.PropertyOptions) {
  return function(proto, propertyKey: string | symbol): void {
    const { connectedCallback, render, componentWillLoad, componentDidLoad } = proto;

    proto.componentWillLoad = function() {
      let self = this;
      let thisElement = getElement(self);
      if (!thisElement.hasAttribute(DATA_DEFINED_PROPS)) {
        return componentWillLoad && componentWillLoad.call(self);
      }
    };

    proto.componentDidLoad = function() {
      let self = this;
      let thisElement = getElement(self);
      if (!thisElement.hasAttribute(DATA_DEFINED_PROPS)) {
        return componentDidLoad && componentDidLoad.call(self);
      }
    };

    proto.connectedCallback = function() {
      let self = this;
      let thisElement = getElement(self);
      let propertyName: string = normalizeCamelCaseToDashed(
        String(propertyKey)
      );

      if (thisElement.hasAttribute(DATA_DEFINED_PROPS)) {
        if (!self.componentDefinitions) {
          self.componentDefinitions = {
            definedProperties: [
              {
                ...opts,
                propertyName: propertyName
              }
            ]
          };
          return connectedCallback && connectedCallback.call(self);
        }

        let componentDefinitions = self.componentDefinitions;
        const newProperty: d.PropertyOptions = {
          ...opts,
          propertyName: propertyName
        };

        if (
          componentDefinitions &&
          componentDefinitions.hasOwnProperty(DEFINED_PROPERTIES)
        ) {
          let tempProps: Array<d.PropertyOptions> = [
            ...componentDefinitions[DEFINED_PROPERTIES]
          ];
          tempProps.push(newProperty);
          componentDefinitions[DEFINED_PROPERTIES] = [...tempProps];
        } else {
          componentDefinitions[DEFINED_PROPERTIES] = [newProperty];
        }
        self.componentDefinitions = { ...componentDefinitions };
      }
      return connectedCallback && connectedCallback.call(self);
    };

    proto.render = function() {
      let self = this;
      if (
        !self.componentDefinitions ||
        !(
          self.componentDefinitions &&
          self.componentDefinitions[DEFINED_PROPERTIES]
        )
      ) {
        return render && render.call(self);
      }

      let definedProps = self.componentDefinitions[DEFINED_PROPERTIES];
      if (definedProps) {
        definedProps = definedProps.reverse();
      }

      createCustomEvent(
        "psk-send-props",
        {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: definedProps
        },
        true
      );
    };
  };
}
