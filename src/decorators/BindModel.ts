import { getElement } from '@stencil/core';
import { ComponentInterface } from "@stencil/core/dist/declarations";
import { createCustomEvent, } from '../utils/utils';
import { assignProperties, getModelEventCbk, changeModel } from '../utils/bindModelUtils';

declare type BindInterface = (
    target: ComponentInterface,
    methodName: string
) => void;

export function BindModel(): BindInterface {
    return function (proto: ComponentInterface): void {

        let { componentWillLoad } = proto;

        proto.componentWillLoad = function () {
            let self = this;

            self['changeModel'] = changeModel;
            self['assignProperties'] = assignProperties;
            let thisElement: HTMLElement = getElement(self);

            setTimeout(function () {
                createCustomEvent('getModelEvent', {
                    bubbles: true,
                    composed: false,
                    cancellable: true,
                    detail: {
                        callback: getModelEventCbk.bind(self)
                    }
                }, true, thisElement);
            }, 0);

            return componentWillLoad && componentWillLoad.call(self);
        };
    };
}