import * as d from './declarations/declarations';
import { DEFINED_PROPERTIES } from './declarations/constants';

export function TableOfContentProperty(opts: d.PropertyOptions) {
    return function (proto, propertyKey: string | symbol): void {

        const { componentWillLoad } = proto;

        proto.componentWillLoad = function () {
            let self = this;
            if (self.helpConfiguration) {
                const tempHelpConf = { ...self.helpConfiguration };
                const newProperty: d.PropertyOptions = {
                    ...opts,
                    propertyName: propertyKey
                };
                if (tempHelpConf.hasOwnProperty(DEFINED_PROPERTIES)) {
                    let tempProps: Array<d.PropertyOptions> = [...tempHelpConf[DEFINED_PROPERTIES]];
                    tempProps.push(newProperty);
                    tempHelpConf[DEFINED_PROPERTIES] = [...tempProps];
                } else {
                    tempHelpConf[DEFINED_PROPERTIES] = [newProperty];
                }
                self.helpConfiguration = { ...tempHelpConf };
            }
            return componentWillLoad && componentWillLoad.call(self);
        };
    }
}