import * as d from './declarations/declarations';
import { DEFINED_METHODS } from './declarations/constants';

export function TableOfContentMethod(opts: d.MethodOptions) {
    return function (proto, propertyKey: string | symbol): void {

        const { componentWillLoad } = proto;

        proto.componentWillLoad = function () {
            let self = this;
            if (self.helpConfiguration) {
                const tempHelpConf = { ...self.helpConfiguration };
                const newProperty: d.MethodOptions = {
                    ...opts,
                    methodName: propertyKey
                };
                if (tempHelpConf.hasOwnProperty(DEFINED_METHODS)) {
                    let tempMethodsDocumentation: Array<d.MethodOptions> = [...tempHelpConf[DEFINED_METHODS]];
                    tempMethodsDocumentation.push(newProperty);
                    tempHelpConf[DEFINED_METHODS] = [...tempMethodsDocumentation];
                } else {
                    tempHelpConf[DEFINED_METHODS] = [newProperty];
                }
                self.helpConfiguration = { ...tempHelpConf };
            }
            return componentWillLoad && componentWillLoad.call(self);
        };
    }
}