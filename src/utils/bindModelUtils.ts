import { getElement } from "@stencil/core";
import { normalizeDashedToCamelCase } from "./utils";
import { DISPLAY_IF_IS, DISPLAY_IF_EXISTS } from "./constants";

/**
 * 
 * @param {any} model
 * @returns {boolean} 
 */
export function __isAbleToBeDisplayed(model: any, element: Element | HTMLElement): boolean {
  if (element.hasAttribute(DISPLAY_IF_EXISTS)) {
    let chain = element.getAttribute(DISPLAY_IF_EXISTS).trim();
    return typeof model.getChainValue(chain) !== 'undefined';
  }

  if (element.hasAttribute(DISPLAY_IF_IS)) {
    let chainValue: String[] = element.getAttribute(DISPLAY_IF_IS).split("|");
    if (chainValue.length !== 2) {
      return false;
    }

    let chain: string = chainValue[0].trim(),
      value: string = chainValue[1].trim();

    return value === model.getChainValue(chain);
  }

  return true;
}

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
 * @description This function checks the component for attributes whose name start with a selector
 * and then it assigns the value from the model according to the chain (if exists)
 * @param {string | null} parentChain
 * @param {any} model
 * @param {string} selector
 * @returns {void}
 */
export function __checkViewModelAttributes(
  parentChain: string | null,
  model: any,
  selector: string,
  callback: Function
): void {
  let __self = this;
  const thisElement = getElement(__self);

  const attributes: Array<Attr> = Array.from(
    thisElement.attributes
  ).filter((attr: Attr) => attr.name.startsWith(selector));

  attributes.forEach((attr: Attr) => {
    const property = normalizeDashedToCamelCase(attr.name.split(selector)[1]);
    const chain = parentChain ? `${parentChain}.${attr.value}` : attr.value;

    __self[property] = model.getChainValue(chain);
  });

  return callback();
}

/**
 * @description This function checks the component for attibutes whose values starts with a selector
 * and then it assigns the value from the model according to the chain (if exists)
 * @param {string | null} parentChain
 * @param {any} model
 * @returns {void}
 */
export function __checkViewModelValues(
  parentChain: string | null,
  model: any,
  selector: string,
  callback: Function
): void {
  let __self = this;
  const thisElement = getElement(__self);

  const attributes: Array<Attr> = Array.from(
    thisElement.attributes
  ).filter((attr: Attr) => attr.value.startsWith(selector));

  attributes.forEach((attr: Attr) => {
    const property = attr.value.split(selector)[1];
    const chain = parentChain ? `${parentChain}.${property}` : property;
    const attributeName = normalizeDashedToCamelCase(attr.name);

    if (model.hasExpression(chain)) { // Check for model expressions first
        __self[attributeName] = model.evaluateExpression(chain);
    } else {
        __self[attributeName] = model.getChainValue(chain);
        model.onChange(chain, function () {
            __self[attributeName] = model.getChainValue(chain);
        })
    }
  });
  return callback();
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
export function __getModelEventCbk(err: Error, model: any, callback: Function): void | boolean {
  if (err || !model) {
    return callback();
  }

  let __self = this;
  let thisElement: HTMLElement = getElement(__self);

  if (!__isAbleToBeDisplayed(model, thisElement)) {
    thisElement.remove();
    return callback();
  }
  /**
   * If we find data-view-model property defined, then we assign the parentChain and the rootModel to the compnent
   * This means we found a psk-for-each component.
   */
  let viewModel, attrNameLabel, parentChain;
  if (
    thisElement.getAttribute("data-view-model") !== null &&
    thisElement.tagName.toLowerCase() === "psk-for-each"
  ) {
    viewModel = thisElement.getAttribute("data-view-model");
    parentChain = viewModel;
    /**
     * Set the rootModel and parentChain
     */
    __self.__assignProperties.call(__self, {
      rootModel: model,
      parentChain: parentChain
    });

    return callback();
  }

  /**
   * If we find view-model property defined, then we skip the checking of the attributes (name, label)
   */
  viewModel = thisElement.getAttribute("view-model");
  parentChain = viewModel;
  if (viewModel === null) {
    attrNameLabel =
      thisElement.getAttribute("name") !== null &&
        !thisElement.getAttribute("name").startsWith("@")
        ? thisElement.getAttribute("name")
        : null;
    if (
      attrNameLabel === null &&
      thisElement.getAttribute("label") !== null &&
      !thisElement.getAttribute("label").startsWith("@")
    ) {
      attrNameLabel = thisElement
        .getAttribute("label")
        .replace(/( |:|\/|\.|-)/g, "")
        .toLowerCase();
    }
    parentChain = attrNameLabel;
  }

  if (!viewModel && !attrNameLabel) {
    /**
     * Check if we have attributes that start with @
     * Similar behaviour as above
     */
    __checkViewModelValues.call(__self, parentChain, model, "@", callback);

    /**
     * Check if we have view-model-* attributes and assign the properties
     */
    __checkViewModelAttributes.call(__self, parentChain, model, "view-model-", callback);

    return callback();
  }

  /**
   * @description Given a property name and a full chain, the method fetches the values for the property
   * and applies an event to the given full chain in order to trigger the two-way binding.
   * @param {string} propertyName The name of the property to be updated from the model
   * @param {string} fullChain The chain in side the model where to search and get the value for propertyName
   * @returns {void} void
   */
  function __setModelViewProperty(
    propertyName: string,
    fullChain: string
  ): void {
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
      return callback();
    }
    __setModelViewProperty("value", fullChain);
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
      return callback();
    }
    Object.keys(parentModel).forEach((key: string) => {
      const fullChain: string = `${parentChain}.${key}`;
      __setModelViewProperty(key, fullChain);
    });

    __registerValueListener();
    return callback();
  }
  return callback();
}
