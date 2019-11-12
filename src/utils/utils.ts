import { RouterHistory } from "@stencil/router";

export function format(first: string, middle: string, last: string): string {
	return (
		(first || '') +
		(middle ? ` ${middle}` : '') +
		(last ? ` ${last}` : '')
	);
}

export function scrollToElement(elementId: string, htmlView: HTMLElement, history: RouterHistory): void {
	if (!history) {
		return;
	}
	const selector = `#${elementId.replace(/#/g, '').replace(/( |:|\/|\.)/g, "-").toLowerCase()}`;
	const chapterElm = htmlView.querySelector(selector);

	if (!chapterElm) {
		return;
	}

	chapterElm.scrollIntoView({
		behavior: 'smooth'
	});

	window.location.hash = selector;
}

export function createCustomEvent(eventName: string, options: any, trigger: boolean = false) {
	const customEvent = new CustomEvent(eventName, options);

	if (trigger) {
		document.dispatchEvent(customEvent);
	}
}

export function closestParentElement(el: HTMLElement, selector: string, stopSelector?: string): HTMLElement {
	var retval = null;
	while (el) {
		if (el.matches(selector)) {
			retval = el;
			break
		} else if (stopSelector && el.matches(stopSelector)) {
			break
		}
		el = el.parentElement;
	}
	return retval;
}