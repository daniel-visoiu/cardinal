import { Chapter } from "../../interfaces/Chapter";
import { scrollToElement, createCustomEvent, highlightCurentChapter } from "../../utils/utils";
import { Component, h, Prop, Listen, State, Element } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import PskScrollEvent from "../../events/ScrollEvent";

@Component({
	tag: "psk-page",
	shadow: true
})
export class PskPage {
	@CustomTheme()

	@State() activeChapter: string = null;
	@State() chapters: Array<Chapter> = [];

	@TableOfContentProperty({
		description: `This property will be used as the title for the page.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() title: string = "";

	@TableOfContentProperty({
		description: `This property is the name of the table of content.`,
		isMandatory: false,
		propertyType: `string`
	})
	@Prop() tocTitle: string;

	@State() componentFullyLoaded: boolean = false;

	@Element() private element: HTMLElement;

	@Listen("psk-send-chapter")
	receiveChapters(evt: CustomEvent): void {
		evt.stopImmediatePropagation();
		if (!evt.detail) {
			return;
		}
		const newChapter: Chapter = { ...evt.detail };
		const findChapterRule = ((elm: Chapter) => {
			return newChapter.guid === elm.guid;
		});

		const chapterIndex: number = this.chapters.findIndex(findChapterRule);

		const tempChapter: Array<Chapter> = [...this.chapters];
		if (chapterIndex === -1) {
			tempChapter.push({
				...newChapter,
			});
			this.chapters = JSON.parse(JSON.stringify(tempChapter));
			return;
		}

		tempChapter[chapterIndex] = {
			...newChapter,
		};
		this.chapters = JSON.parse(JSON.stringify(tempChapter));
	}

	_checkForChapterScrolling(): void {
		if (window.location.href.indexOf("chapter=") === -1) {
			return;
		}

		const chapterName = window.location.href.split("chapter=")[1];

		setTimeout(() => {
			scrollToElement(chapterName, this.element);
		}, 50);
	}

	_sendTableOfContentChapters(): void {
		createCustomEvent('psk-send-toc', {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: {
				chapters: this.chapters,
				active: this.activeChapter
			}
		}, true);
	}

	componentDidLoad() {
		this.componentFullyLoaded = true;
		document.addEventListener('pageScroll', this.handleScrollEvent, true);
		this._checkForChapterScrolling();
	}

	disconnectedCallback() {
		document.removeEventListener('pageScroll', this.handleScrollEvent, true);
	}

	private handleScrollEvent = (evt: PskScrollEvent) => {
		highlightCurentChapter.call(this, evt);
	};

	render() {
		this._sendTableOfContentChapters();

		return (
			<div>
				<nav><h3>{this.title}</h3></nav>
				<div class="page-content container">
					{this.componentFullyLoaded ? <slot />
						: <psk-ui-loader shouldBeRendered={true} />}
				</div>
			</div>
		)
	}
}