import { getElement } from "@stencil/core";
import { BUILD } from '@stencil/core/build-conditionals';

import * as d from "./declarations/declarations";
import { HELP_PROPERTY, PSK_TOC_DOCUMENTATION } from "./declarations/constants";

export function TableOfContentClass(opts?: d.ClassOptions) {
    // @ts-ignore
    return function (proto, ...args) {
        BUILD.cmpWillLoad = true;
        let renderHelpSection = true;
        let { render, componentWillLoad } = proto;

        proto.componentWillLoad = function () {
            let self = this;
            const thisElement = getElement(self);
            renderHelpSection = thisElement.hasAttribute(HELP_PROPERTY);
            if (renderHelpSection) {
                self.helpConfiguration = {
                    baseClass: { ...opts }
                };
            }
            return componentWillLoad && componentWillLoad.call(self);
        };

        proto.render = function () {
            let self = this;
            if (!renderHelpSection) {
                return render && render.call(self);
            }

            document.dispatchEvent(new CustomEvent(PSK_TOC_DOCUMENTATION, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: self.helpConfiguration
            }));
        }
    }
}