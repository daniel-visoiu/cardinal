import { Component, h, Prop, Event, EventEmitter, Listen, getElement, State } from "@stencil/core";
import * as d from "../../decorators/declarations/declarations";

@Component({
	tag: "psk-chapter",
	styleUrl: './page.css'
})
export class PskChapter {

	@Listen('psk-send-props', { target: "document" })
	receivedPropertiesDescription(evt: CustomEvent) {
		evt.stopImmediatePropagation();
		if (evt.detail && evt.detail.length > 0) {
			this.decoratorProperties = [...evt.detail];
		}
	}

	@Listen('psk-send-events', { target: "document" })
	receivedEventsDescription(evt: CustomEvent) {
		evt.stopImmediatePropagation();
		if (evt.detail && evt.detail.length > 0) {
			this.decoratorEvents = [...evt.detail];
		}
	}

	@Prop() title: string;

	@State() chapterInfo: {
		data: string,
		guid: string,
		children: Array<any>
	};
	@State() guid: string;
	@State() reportedToc: boolean = false;

	@State() decoratorProperties: Array<d.PropertyOptions>;
	@State() decoratorEvents: Array<d.EventOptions>;

	@Event({
		eventName: "psk-send-chapter",
		bubbles: true,
		composed: false,
		cancelable: true
	}) sendChapter: EventEmitter;

	constructor() {
		let _uuidv4 = () => {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		};

		this.chapterInfo = {
			data: this.title,
			guid: _uuidv4(),
			children: []
		}
	}

	componentDidLoad() {
		if (!this.reportedToc) {
			this.sendChapter.emit(this.chapterInfo)
		}
	}

	@Listen("psk-send-chapter")
	receivedChapter(event: any) {
		if (event.path && event.path[0] && getElement(this) !== event.path[0]) {
			event.stopImmediatePropagation();

			if (this.chapterInfo.children.length > 0) {
				let isExistingChild = false;
				this.chapterInfo.children.forEach((child) => {
					if (child.guid === event.detail.guid) {
						child.children = event.detail.children;
						isExistingChild = true;
					}
				});
				if (!isExistingChild) {
					this.chapterInfo.children.push(event.detail);
				}
			} else {
				this.chapterInfo.children.push(event.detail);
			}

			this.sendChapter.emit(this.chapterInfo);
			this.reportedToc = true;
		}
	}

	render() {
		let componentPropertiesDefinitions = [];
		if (this.decoratorProperties) {
			componentPropertiesDefinitions = this.decoratorProperties.map((prop: d.PropertyOptions) => {
				const cardTitle = `${prop.propertyName}${prop.isMandatory ? "" : "?"}: ${prop.propertyType} ${prop.isMandatory ? "(mandatory)" : "(optional)"}`;
				return (
					<psk-card title={cardTitle}>
						{prop.description}
						{prop.specialNote ? (<p><b>Note: {prop.specialNote}</b></p>) : null}
						{prop.defaultValue ? (<p><i>Default value: {prop.defaultValue}</i></p>) : null}
					</psk-card>
				);
			});
		}

		let componentEventsDefinitions = [];
		if (this.decoratorEvents) {
			componentEventsDefinitions = this.decoratorEvents.map((event: d.EventOptions) => {
				const cardTitle = `${event.eventName}: CustomEvent`
				return (
					<psk-card title={cardTitle}>
						<p>{event.description}</p>
						{event.specialNote ? (<p><b>Note: {event.specialNote}</b></p>) : null}
					</psk-card>
				);
			});
		}

		return [
			<div id={this.chapterInfo.guid}>{this.title}</div>,
			<slot />,
			componentEventsDefinitions,
			componentPropertiesDefinitions
		];
	}
}