import { Component, h, Element, Host, Prop } from '@stencil/core';
import { BindModel } from '../../decorators/BindModel';
import CustomTheme from '../../decorators/CustomTheme';

import { BREADCRUMB_CONSTANTS } from '../../utils/constants';
import { BreadcrumbSegment } from '../../interfaces/BreadcrumbSegment';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';

@Component({
	tag: 'psk-breadcrumb-navigator',
	styleUrls: {
		default: './styles/psk-breadcrumb-navigator.default.css',
		arrows: './styles/psk-breadcrumb-navigator.arrows.css',
		scroll: './styles/psk-breadcrumb-navigator.scroll.css'
	},
	shadow: true
})
export class PskBreadcrumbNavigator {

	private __activeSegment: HTMLElement;

	@BindModel() modelHandler;

	@CustomTheme()

	@Element() private __hostElement: HTMLElement;

	@TableOfContentProperty({
		description: ["The event name that will be triggered on clicking a segment of the breadcrumb navigator. This is the event that needs to be listened inside the controller.",
			"If not defined, the default value will be considered. (breadcrumb-click)"],
		isMandatory: false,
		propertyType: "string",
		defaultValue: BREADCRUMB_CONSTANTS.BREADCRUMB_CLICK
	})
	@Prop() eventName: string | null = BREADCRUMB_CONSTANTS.BREADCRUMB_CLICK;

	@TableOfContentProperty({
		description: ["This attribute should receive an array of BreadcrumbSegment. BreadcrumbSegment interface accepts two attributes: label and path.",
			"The label will be displayed and the path will be sent as event-data when the user clicks on a segment of the breadcrumb.",
			`Detailed examples of usage are presented below, on "How to use" section.`],
		isMandatory: true,
		propertyType: "BreadcrumbSegment[] (Array of BreadcrumbSegment type)",
		specialNote: "If this property does not receive an array of BreadcrumbSegment, the component will not be rendered."
	})
	@Prop() segments: BreadcrumbSegment[] = [];

	__firstSegmentClickHandler = (event: Event): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		this.__activeSegment = this.__getFirstSegment();
		this.__scrollToActiveSegment();
	}

	__lastSegmentClickHandler = (event: Event): void => {
		event.preventDefault();
		event.stopImmediatePropagation();

		this.__activeSegment = this.__getLastSegment();
		this.__scrollToActiveSegment();
	}

	__scrollToActiveSegment = (): void => {
		if (this.__isScrollDisplayed()) {
			this.__activeSegment.scrollIntoView({
				behavior: "smooth",
				block: "start",
				inline: "start"
			});
		}
	}

	__isScrollDisplayed = (): boolean => {
		return this.__hostElement.scrollWidth > this.__hostElement.clientWidth;
	}

	__getFirstSegment = (): HTMLElement => {
		return this.__hostElement.shadowRoot.querySelector("psk-button");
	}

	__getLastSegment = (): HTMLElement => {
		return this.__hostElement.shadowRoot.querySelector("psk-button:last-of-type");
	}

	__getMode = (): string => {
		return (this.__hostElement as any).mode
			|| this.__hostElement.getAttribute('mode')
			|| 'default';
	}

	render() {
		if (this.segments.length) {
			return null;
		}

		let previousSegmentArrow: HTMLElement = null,
			nextSegmentArrow: HTMLElement = null;

		if (this.__getMode() === BREADCRUMB_CONSTANTS.ARROWS) {
			previousSegmentArrow = (
				<psk-icon
					icon="arrow-left"
					id={BREADCRUMB_CONSTANTS.PREVIOUS_ID}
					onClick={this.__firstSegmentClickHandler} />
			);
			nextSegmentArrow = (
				<psk-icon
					icon="arrow-right"
					id={BREADCRUMB_CONSTANTS.NEXT_ID}
					onClick={this.__lastSegmentClickHandler} />
			);

			this.__activeSegment = this.__getFirstSegment();
		}

		let segmentList: HTMLElement[] = this.segments.map((segment: BreadcrumbSegment, index: number) => {
			const disabled: string = index + 1 === this.segments.length ? "true" : "false";
			return (
				<psk-button
					button-class=" "
					label={segment.label}
					event-name={this.eventName}
					event-data={segment.path}
					disabled={disabled} />
			);
		});

		return (
			<Host>
				{previousSegmentArrow}
				{segmentList}
				{nextSegmentArrow}
			</Host>
		);
	}
}
