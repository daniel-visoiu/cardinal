export function format(first: string, middle: string, last: string): string {
	return (
		(first || '') +
		(middle ? ` ${middle}` : '') +
		(last ? ` ${last}` : '')
	);
}

export function scrollToElement(elementId: string, htmlView: HTMLElement): void {
	const selector = elementId.replace(/( |:|\/|\.)/g, "-").toLowerCase();
	const chapterElm = htmlView.querySelector(`#${selector}`);

	if (!chapterElm) {
		return;
	}

	chapterElm.scrollIntoView({
		behavior: 'smooth'
	});

	let basePath = window.location.href;
	let queryOperator = "?";
	if (basePath.indexOf("chapter=") !== -1) {
		basePath = window.location.href.split("chapter=")[0];
		if (basePath.length > 0) {
			queryOperator = basePath[basePath.length - 1];
			basePath = basePath.substring(0, basePath.length - 1);
		}
	}
	else {
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
export function createCustomEvent(eventName: string, options: any,
	trigger: boolean = false, triggerElement: HTMLElement = null) {

	const customEvent = new CustomEvent(eventName, options);

	if (trigger) {
		if (triggerElement) {
			triggerElement.dispatchEvent(customEvent);
		} else {
			document.dispatchEvent(customEvent);
		}
	}
}

export function closestParentElement(el: HTMLElement, selector: string, stopSelector?: string): HTMLElement {
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

export function normalizeInnerHTML(source: string = ''): string {
	return source.replace(/<!----->/g, '').replace(/<!---->/g, '');
}