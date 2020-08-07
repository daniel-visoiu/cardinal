import { INVALID_ID_CHARACTERS_REGEX } from "./constants";
import {getElement} from "@stencil/core";

export function format(first: string, middle: string, last: string): string {
  return (
    (first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : "")
  );
}

export function scrollToElement(
  elementId: string,
  htmlView: HTMLElement
): void {
  const selector = normalizeElementId(elementId);
  const chapterElm = htmlView.querySelector(`#${selector}`);

  if (!chapterElm) {
    return;
  }

  chapterElm.scrollIntoView();

  let basePath = window.location.href;
  let queryOperator = "?";
  if (basePath.indexOf("chapter=") !== -1) {
    basePath = window.location.href.split("chapter=")[0];
    if (basePath.length > 0) {
      queryOperator = basePath[basePath.length - 1];
      basePath = basePath.substring(0, basePath.length - 1);
    }
  } else {
    queryOperator = basePath.indexOf("?") > 0 ? "&" : "?";
  }
  let chapterKey = `${queryOperator}chapter=`;
  window.history.pushState({}, "", `${basePath}${chapterKey}${selector}`);
}
//TODO refactor this
/**
 * @deprecated You should create your own Event. See /events/PskButtonEvent.ts example
 * @param eventName
 * @param options
 * @param trigger
 * @param triggerElement
 */
export function createCustomEvent(
  eventName: string,
  options: any,
  trigger: boolean = false,
  triggerElement: HTMLElement = null
) {
  const customEvent = new CustomEvent(eventName, options);

  if (trigger) {
    if (triggerElement) {
      triggerElement.dispatchEvent(customEvent);
    } else {
      document.dispatchEvent(customEvent);
    }
  }
}

export function closestParentElement(
  el: HTMLElement,
  selector: string,
  stopSelector?: string
): HTMLElement {
  let retval = null;
  while (el) {
    if (el.matches(selector)) {
      retval = el;
      break;
    } else if (stopSelector && el.matches(stopSelector)) {
      break;
    }
    el = el.parentElement;
  }
  return retval;
}

export function closestParentTagElement(
  el: HTMLElement,
  tag: string,
  deepLevel: number = 1
): HTMLElement {
  let retval = null;
  while (el) {
    if (el.tagName.toLowerCase() === tag && --deepLevel === 0) {
      retval = el;
      break;
    }
    el = el.parentElement;
  }
  return retval;
}

export function normalizeInnerHTML(source: string = ""): string {
  return source.replace(/<!----->/g, "").replace(/<!---->/g, "");
}

export function normalizeCamelCaseToDashed(source: string): string {
  if (!source || typeof source !== 'string' || source.length === 0) {
    return '';
  }

  return source
    .split("")
    .map((letter: string) => {
      if (letter === letter.toLowerCase()) {
        return letter;
      }

      return `-${letter.toLowerCase()}`;
    })
    .join("");
}


export function normalizeDashedToCamelCase(source: string): string {
  if (!source || typeof source !== 'string' || source.length === 0) {
    return '';
  }

  return source
    .split("-")
    .map((word: string, index: number) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}
/**
 * normalize a string to be compliant with a HTML id value
 * @param source
 */
export function normalizeElementId(source: string): string {
  let normalizedId = source.replace(INVALID_ID_CHARACTERS_REGEX, "-").toLowerCase();
  normalizedId = normalizedId.replace(/(-+){2}/gm, "-");
  normalizedId = normalizedId.replace(/(-+)$/gm, "");
  return normalizedId;
}

/**
 *
 * @param source
 * @param regex
 * @param replaceString
 * @param applyCallback - A callback function that will be applyed to the string result
 */
export function normalizeRegexToString(
  source: string,
  regex: RegExp,
  replaceString: string,
  applyCallback: Function = null
): string {
  let result = source.replace(regex, replaceString);
  if (applyCallback) {
    return applyCallback(result);
  }
  return result;
}

export function canAttachShadow(tagName: string): boolean {
  if (tagName.startsWith("psk-")) {
    return true;
  }

  const found = [
    "article",
    "aside",
    "blockquote",
    "body",
    "div",
    "footer",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "main",
    "nav",
    "p",
    "section",
    "span"
  ].find((htmlTag: string) => htmlTag === tagName);

  return found === tagName;
}

export function normalizeModelChain(chain){
  if(typeof chain !== "string"){
    throw new Error("Invalid model chain");
  }
  return chain.split("@").join("");
}

export function stringToBoolean(str){
  if(typeof str === "boolean"){
    return str;
  }
  if (typeof str === "string") {
    switch (str.toLowerCase().trim()) {
      case "true":
      case "1":
        return true;
      case "false":
      case "0":
      case null:
        return false;
      default:
        return Boolean(str);
    }
  }

  return Boolean(str);
}

export function dashToCamelCase( str ) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

export function getInnerHTML(component) {
  const host = getElement(component);
  if (!host.innerHTML) {
    return null;
  }

  let styleElement = host.querySelector('style');
  if (styleElement) {
    let content = host.innerHTML.replace(styleElement.outerHTML, "");
    host.innerHTML = styleElement.outerHTML;
    return content;
  }
  return host.innerHTML;

};
