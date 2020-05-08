import * as d from './declarations/declarations';
import { getElement } from '@stencil/core';
import {
  DATA_DEFINED_EVENTS,
  DEFINED_EVENTS,
  DEFINED_CONTROLLERS,
  DATA_DEFINED_CONTROLLERS

} from '../utils/constants';
import { createCustomEvent } from '../utils/utilFunctions';

export function TableOfContentEvent(opts: d.EventOptions) {
    return function (proto, propertyKey: string | symbol): void {

        const { connectedCallback, componentWillLoad, componentDidLoad, render } = proto;
        let actionSend = 'psk-send-events';
        let typeDefined = DEFINED_EVENTS;
        let dataDefineAction = DATA_DEFINED_EVENTS;
        let definedAction = 'definedEvents';


      proto.componentWillLoad = function() {
        let self = this;
        let thisElement = getElement(self);
        if (!thisElement.hasAttribute(DATA_DEFINED_EVENTS) && !thisElement.hasAttribute(DATA_DEFINED_CONTROLLERS)) {
          return componentWillLoad && componentWillLoad.call(self);
        }
      };

      proto.componentDidLoad = function() {
        let self = this;
        let thisElement = getElement(self);
        if (!thisElement.hasAttribute(DATA_DEFINED_EVENTS) && !thisElement.hasAttribute(DATA_DEFINED_CONTROLLERS)) {
          return componentDidLoad && componentDidLoad.call(self);
        }
      };

        proto.connectedCallback = function () {
            let self = this;
            let thisElement = getElement(self);

            if (opts.controllerInteraction) {
                dataDefineAction = DATA_DEFINED_CONTROLLERS;
                definedAction = 'definedControllers'
                typeDefined = DEFINED_CONTROLLERS
                actionSend = 'psk-send-controllers'
            }

            if (thisElement.hasAttribute(dataDefineAction)) {
                if (!self.componentDefinitions) {
                    self.componentDefinitions = {}
                    self.componentDefinitions[definedAction] = [{
                        ...opts,
                        eventName: String(propertyKey)
                    }]
                    return connectedCallback && connectedCallback.call(self);
                }

                let componentDefinitions = self.componentDefinitions;
                const newEvent: d.EventOptions = {
                    ...opts,
                    eventName: String(propertyKey)
                };

                if (componentDefinitions && componentDefinitions.hasOwnProperty(typeDefined)) {
                    let tempProps: Array<d.EventOptions> = [...componentDefinitions[typeDefined]];
                    tempProps.push(newEvent);
                    componentDefinitions[typeDefined] = [...tempProps];
                } else {
                    componentDefinitions[typeDefined] = [newEvent];
                }

                self.componentDefinitions = { ...componentDefinitions };
            }

            return connectedCallback && connectedCallback.call(self);
        };

        proto.render = function () {
            let self = this;
            if (!self.componentDefinitions
                || !(self.componentDefinitions && self.componentDefinitions[typeDefined])) {
                return render && render.call(self);
            }

            let definedEvts = self.componentDefinitions[typeDefined];
            if (definedEvts) {
                definedEvts = definedEvts.reverse();
            }
            createCustomEvent(actionSend, {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: definedEvts
            }, true);
        }
    }
}
