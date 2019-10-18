// import { getElement } from "@stencil/core";
import { BUILD } from '@stencil/core/build-conditionals';

import * as d from "./declarations/declarations";

export function TableOfContentClass(opts: d.ClassOptions) {
    return function (proto, ...args): void {
        console.log(args);
        BUILD.cmpWillLoad = true;
        const { render, help } = proto;
        let renderHelpSection = typeof help === 'undefined';

        // proto.componentWillLoad = function () {
        //     console.log('lalalalalalala');
        //     const host = getElement(this);
        //     if (!host.hasAttribute('help')) {
        //         console.log(host);

        //     }

        //     return componentWillLoad && componentWillLoad.call(this);
        // };

        proto.render = function () {
            if (!renderHelpSection) {
                console.log('here1');
                return render && render.call(this);
            } else {
                console.log('here2');
                proto.helpConfiguration = {
                    baseClass: { ...opts }
                };
                return render && render.apply(this, proto);
            }
        };
    }
}

export function TableOfContentProperty(opts: d.PropertyOptions) {
    console.log("Property options", opts);
    return function (proto, propertyKey: string | symbol): void {
        const { helpConfiguration } = proto;
        console.log("help config from class", helpConfiguration);
        if (!helpConfiguration) {
            return;
        }
        console.log('We have the data.... yeyy!!!', propertyKey, helpConfiguration);
    }
}