import { Component, h, Prop, Event, EventEmitter, Listen, getElement, State } from "@stencil/core";
import { Chapter } from "../../interfaces/Chapter";

@Component({
	tag: "psk-chapter",
	styleUrl: './page.css'
})
export class PskChapter {

	@Prop({ reflect: true }) title: string = "";
	@Prop({ reflect: true, mutable: true }) guid: string;

	@State() chapterInfo: Chapter;
	@State() reportedToc: boolean = false;

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

		this.guid = _uuidv4();

		this.chapterInfo = {
			title: this.title,
			guid: this.guid,
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
		return (
			<psk-card
				title={this.title}
				id={this.title.replace(/( |:|\/|\.)/g, "-").toLowerCase()}>
				<slot />
			</psk-card>
		);
	}
}