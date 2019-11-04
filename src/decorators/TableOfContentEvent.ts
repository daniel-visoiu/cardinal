import * as d from './declarations/declarations';
import { getElement } from '@stencil/core';
import { DATA_DEFINED_EVENTS, DEFINED_EVENTS, DATA_DEFINED_CONTROLLERS, DEFINED_CONTROLLERS } from '../utils/constants';
import { createCustomEvent } from '../utils/utils';

export function TableOfContentEvent(opts: d.EventOptions) {
    return function (proto, propertyKey: string | symbol): void {

        const { connectedCallback, render } = proto;

        proto.connectedCallback = function () {
            let self = this;
            let thisElement = getElement(self);
            if (opts.controllerInteraction != true) {
                if (thisElement.hasAttribute(DATA_DEFINED_EVENTS)) {
                    if (!self.componentDefinitions) {
                        self.componentDefinitions = {
                            "definedEvents": [{
                                ...opts,
                                eventName: String(propertyKey)
                            }]
                        };
                        return connectedCallback && connectedCallback.call(self);
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
                return connectedCallback && connectedCallback.call(self);
            } else {
                if (thisElement.hasAttribute(DATA_DEFINED_CONTROLLERS)) {
                    if (!self.componentDefinitions) {
                        self.componentDefinitions = {
                            "definedControllers": [{
                                ...opts,
                                eventName: String(propertyKey)
                            }]
                        };
                        return connectedCallback && connectedCallback.call(self);
                    }
                    let componentDefinitions = self.componentDefinitions;
                    const newEvent: d.EventOptions = {
                        ...opts,
                        eventName: String(propertyKey)
                    };

                    if (componentDefinitions && componentDefinitions.hasOwnProperty(DEFINED_CONTROLLERS)) {
                        let tempProps: Array<d.EventOptions> = [...componentDefinitions[DEFINED_CONTROLLERS]];
                        tempProps.push(newEvent);
                        componentDefinitions[DEFINED_CONTROLLERS] = [...tempProps];
                    } else {
                        componentDefinitions[DEFINED_CONTROLLERS] = [newEvent];
                    }
                    self.componentDefinitions = { ...componentDefinitions }; 
                    console.log(self.componentDefinitions)
                }
                return connectedCallback && connectedCallback.call(self);
            }
        };

        proto.render = function () {
            let self = this;
            if (!self.componentDefinitions
                || !(self.componentDefinitions && self.componentDefinitions[DEFINED_EVENTS])) {
                return render && render.call(self);
            }

            let definedEvts = self.componentDefinitions[DEFINED_EVENTS];
            if (definedEvts) {
                definedEvts = definedEvts.reverse();
            }
            let definedCntrl = self.componentDefinitions[DEFINED_CONTROLLERS];
            if (definedEvts) {
                definedEvts = definedEvts.reverse();
            }

            createCustomEvent('psk-send-events', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: definedEvts
            }, true);
            createCustomEvent('psk-send-controllers', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: definedCntrl
            }, true)
        }
    }
}