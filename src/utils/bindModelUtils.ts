import { getElement } from "@stencil/core";

/**
 * @description This function will assign to the target object the parameters found inside params
 * @param params JavaScript object of type { key: value } containing the properties to be updated and their new values
 */
export function __assignProperties(params: any): void {
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
 * @description This method is represents the callback function applied to the getModelEvent event.
 * The method receives the model from the controller and then is parsing the component for attributes with all the values starting with "@".
 * If the components has the view-model attribute defined, then the component is filled with the properties defined in the model.
 * If the components is not defined, then the sub-model is searched using the name or label attributes defined in the component.
 * @param err The error sent in case of any error encountered during event processing
 * @param model The proxified model
 * @returns void
 */
export function __getModelEventCbk(err: Error, model: any): void {

    console.log(`[__getModelEventCbk] the event has beed called!`, this);

    if (err || !model) {
        return;
    }

    let __self = this;
    let thisElement: HTMLElement = getElement(__self);

    console.log(`[__getModelEventCbk] ${thisElement.tagName}`);

    /**
     * If we find data-view-model property defined, then we assign the parentChain and the rootModel to the compnent
     * This means we found a psk-for-each component.
     */
    let viewModel, attrNameLabel, parentChain;
    if (thisElement.getAttribute('data-view-model') !== null
        && thisElement.tagName.toLowerCase() === 'psk-for-each') {
        viewModel = thisElement.getAttribute('data-view-model');
        parentChain = viewModel;
        /**
         * Set the rootModel and parentChain
         */
        __self.__assignProperties.call(__self, {
            rootModel: model,
            parentChain: parentChain
        });

        /**
         * Special behaviour only for psk-for-each component.
         * Render must be called in order to trigger the update,
         * because none of the assigned attributes is watched by the Stencil Listener (State)
         */
        __self['render'].call(__self);
        return;
    }

    /**
    * If we find view-model property defined, then we skip the checking of the attributes (name, label)
    */
    viewModel = thisElement.getAttribute('view-model');
    parentChain = viewModel;
    if (viewModel === null) {
        attrNameLabel = thisElement.getAttribute('name');
        if (attrNameLabel === null && thisElement.getAttribute('label') !== null) {
            attrNameLabel = thisElement.getAttribute('label').replace(/( |:|\/|\.|-)/g, "").toLowerCase();
        }
        parentChain = attrNameLabel;
    }

    console.log(`[viewModel and attrNameLabel] ${viewModel} --&&-- ${attrNameLabel}`);

    if (!viewModel && !attrNameLabel) {
        console.error('[Bind Model] At least one of the attributes should be defined in order to apply the binding: data-view-model(only for psk-for-each), view-model, name, label');
        return;
    }

    /**
     * @description Given a property name and a full chain, the method fetches the values for the property
     * and applies an event to the given full chain in order to trigger the two-way binding.
     * @param propertyName The name of the property to be updated from the model
     * @param fullChain The chain in side the model where to search and get the value for propertyName
     * @returns void
     */
    function __setModelViewProperty(propertyName: string, fullChain: string): void {
        __self[propertyName] = model.getChainValue(fullChain);
        /**
         * Apply onChange to the modifiable attributes (e.g. value, selected)
         */
        model.onChange(fullChain, function (): void {
            __self[propertyName] = model.getChainValue(fullChain);
        });
    }

    /**
     * @description This function is checking if the sub-model has an attribute named "value".
     * If the attribute is present, the function is stopped.
     * If not, the function is registering the chain in order to update the model.
     * @returns void
     */
    function __registerValueListener(): void {
        const fullChain: string = `${parentChain}.value`;
        let parentModel: any = model.getChainValue(parentChain);
        if (!parentModel || model.getChainValue(fullChain)) {
            return;
        }
        console.warn('[Initialize] init chain for', fullChain);
        __setModelViewProperty('value', fullChain);
    }

	/**
	 * Set the rootModel and parentChain
	 */
    __self.__assignProperties.call(__self, {
        rootModel: model,
        parentChain: parentChain
    });
	/**
	 * END
	 */

    /**
     * Assign the component all the attributes defined inside the model.
     * This code is being executed only if view-model is defined.
     */
    if (viewModel) {
        let parentModel: any = model.getChainValue(parentChain);
        if (!parentModel) {
            return;
        }
        Object.keys(parentModel).forEach((key: string) => {
            const fullChain: string = `${parentChain}.${key}`;
            __setModelViewProperty(key, fullChain);
        });

        __registerValueListener();
        return;
    }

	/**
	 * Parse the component's attributes and look for those who start with @ symbol. 
     * This code is beeing executed if view-model is not defined.
	 */
    for (let index: number = 0; index < thisElement.attributes.length; ++index) {
        const attr: Attr = thisElement.attributes[index];
        if (attr.value.startsWith('@')) {
            const attrName: string = attr.value.split('@')[1];

            const fullChain: string = parentChain ? `${parentChain}.${attrName}` : attrName;
            __setModelViewProperty(attrName, fullChain);
        }
    }
    __registerValueListener();
}