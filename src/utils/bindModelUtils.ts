import { getElement } from "@stencil/core";

/**
 * @description This function will assign to the target object the parameters found inside @param params
 * @param params JavaScript object of type { key: value } containing the properties to be updated and their new values
 */
export function assignProperties(params: any): void {
    let __self = this;
    Object.keys(params).forEach(function (key) {
        __self[key] = params[key];
    });
}

/**
 * @description This function is intending to update the model on a given chain. 
 * The target object may contain the parentChain attribute. If it is present, 
 * then the fullChain that is being updated is built from parentChain and leafChain. 
 * If not, then fullChain to be updated is equal to leafChain.
 * @param leafChain 
 * @param newValue 
 */
export function changeModel(leafChain: string, newValue: any): boolean {
    try {
        let __self = this;
        if (__self.rootModel) {
            let fullChain = leafChain;
            if (__self.parentChain) {
                fullChain = `${__self.parentChain}.${leafChain}`;
            }
            __self.rootModel.setChainValue(fullChain, newValue);
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
    }
    return false;
}

/**
 * 
 * @param err The error sent in case of any error encountered during event processing
 * @param model The proxified model
 */
export function getModelEventCbk(err: Error, model: any): void {
    let __self = this;
    let thisElement: HTMLElement = getElement(__self);
    let componentAttrName = thisElement.getAttribute('name');
    if (componentAttrName === null && thisElement.getAttribute('label') !== null) {
        componentAttrName = thisElement.getAttribute('label').replace(/( |:|\/|\.|-)/g, "").toLowerCase();
    }
    if (err || componentAttrName === null || !model) {
        return;
    }

	/**
	 * Set the rootModel and parentChain
	 */
    __self.assignProperties.call(__self, {
        rootModel: model,
        parentChain: componentAttrName
    });
	/**
	 * END
	 */

	/**
	 * Parse the component's attributes and look for those
	 * who start with @ symbol
	 */
    for (let index = 0; index < thisElement.attributes.length; ++index) {
        const attr: Attr = thisElement.attributes[index];
        if (attr.value.startsWith('@')) {
            const attrName = attr.value.split('@')[1];

            const fullChain = componentAttrName
                ? `${componentAttrName}.${attrName}`
                : attrName;

            __self[attrName] = model.getChainValue(fullChain);
			/**
			 * Apply onChange to the modifiable attributes (e.g. value, selected)
			 */
            model.onChange(fullChain, function () {
                attr.value = model.getChainValue(fullChain);
            });
        }
    }
}