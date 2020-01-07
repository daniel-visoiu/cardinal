import { getElement } from '@stencil/core';
import { ComponentInterface } from "@stencil/core/dist/declarations";
import { createCustomEvent, } from '../utils/utils';
import { __assignProperties, __getModelEventCbk, changeModel } from '../utils/bindModelUtils';

declare type BindInterface = (
    target: ComponentInterface,
    methodName: string
) => void;

export function BindModel(): BindInterface {
    return function (proto: ComponentInterface): void {

        let { componentWillLoad, render } = proto;

        proto.componentWillLoad = function () {
            let self = this;
            let thisElement: HTMLElement = getElement(self);

            document.addEventListener('modelReady', function () {
                createCustomEvent('getModelEvent', {
                    bubbles: true,
                    composed: false,
                    cancellable: true,
                    detail: {
                        callback: __getModelEventCbk.bind(self)
                    }
                }, true, thisElement);
            });

            self['render'] = render;
            self['changeModel'] = changeModel;
            self['__assignProperties'] = __assignProperties;

            return componentWillLoad && componentWillLoad.call(self);
        };
    };
}