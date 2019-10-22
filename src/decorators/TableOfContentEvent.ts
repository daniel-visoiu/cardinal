import * as d from './declarations/declarations';
import { getElement } from '@stencil/core';
import { DATA_DEFINED_EVENTS, DEFINED_EVENTS } from './declarations/constants';

export function TableOfContentEvent(opts: d.EventOptions) {
    return function (proto, propertyKey: string | symbol): void {

        const { componentWillLoad, render } = proto;

        proto.componentWillLoad = function () {
            let self = this;
            let thisElement = getElement(self);

            if (thisElement.hasAttribute(DATA_DEFINED_EVENTS)) {
                if (!self.componentDefinitions) {
                    self.componentDefinitions = {
                        "definedEvents": [{
                            ...opts,
                            eventName: String(propertyKey)
                        }]
                    };
                    return componentWillLoad && componentWillLoad.call(self);
                }

                let componentDefinitions = self.componentDefinitions;
                const newEvent: d.EventOptions = {
                    ...opts,
                    eventName: String(propertyKey)
                };

                if (componentDefinitions && componentDefinitions.hasOwnProperty(DEFINED_EVENTS)) {
                    let tempProps: Array<d.EventOptions> = [...componentDefinitions[DEFINED_EVENTS]];
                    tempProps.push(newEvent);
                    componentDefinitions[DEFINED_EVENTS] = [...tempProps];
                } else {
                    componentDefinitions[DEFINED_EVENTS] = [newEvent];
                }
                self.componentDefinitions = { ...componentDefinitions };
            }
            return componentWillLoad && componentWillLoad.call(self);
        };

        proto.render = function () {
            let self = this;
            if (!self.componentDefinitions
                || !(self.componentDefinitions && self.componentDefinitions[DEFINED_EVENTS])) {
                return render && render.call(self);
            }

            document.dispatchEvent(new CustomEvent('psk-send-events', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: self.componentDefinitions[DEFINED_EVENTS]
            }));
        }
    }
}