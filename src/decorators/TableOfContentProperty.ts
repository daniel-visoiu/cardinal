import * as d from './declarations/declarations';
import { DEFINED_PROPERTIES, DATA_DEFINED_PROPS } from './declarations/constants';
import { getElement } from '@stencil/core';

export function TableOfContentProperty(opts: d.PropertyOptions) {
    return function (proto, propertyKey: string | symbol): void {

        const { connectedCallback, render } = proto;

        proto.connectedCallback = function () {
            let self = this;
            let thisElement = getElement(self);

            if (thisElement.hasAttribute(DATA_DEFINED_PROPS)) {
                if (!self.componentDefinitions) {
                    self.componentDefinitions = {
                        "definedProperties": [{
                            ...opts,
                            propertyName: String(propertyKey)
                        }]
                    };
                    return connectedCallback && connectedCallback.call(self);
                }

                let componentDefinitions = self.componentDefinitions;
                const newProperty: d.PropertyOptions = {
                    ...opts,
                    propertyName: String(propertyKey)
                };

                if (componentDefinitions && componentDefinitions.hasOwnProperty(DEFINED_PROPERTIES)) {
                    let tempProps: Array<d.PropertyOptions> = [...componentDefinitions[DEFINED_PROPERTIES]];
                    tempProps.push(newProperty);
                    componentDefinitions[DEFINED_PROPERTIES] = [...tempProps];
                } else {
                    componentDefinitions[DEFINED_PROPERTIES] = [newProperty];
                }
                self.componentDefinitions = { ...componentDefinitions };
            }
            return connectedCallback && connectedCallback.call(self);
        };

        proto.render = function () {
            let self = this;
            if (!self.componentDefinitions
                || !(self.componentDefinitions && self.componentDefinitions[DEFINED_PROPERTIES])) {
                return render && render.call(self);
            }

            document.dispatchEvent(new CustomEvent('psk-send-props', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: self.componentDefinitions[DEFINED_PROPERTIES]
            }));
        }
    }
}