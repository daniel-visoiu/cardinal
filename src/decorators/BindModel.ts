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

        let { componentDidLoad } = proto;

        proto.componentDidLoad = function () {
            let self = this;
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

            self['changeModel'] = changeModel;
            self['assignProperties'] = assignProperties;

            return componentDidLoad && componentDidLoad.call(self);
        };
    };
}