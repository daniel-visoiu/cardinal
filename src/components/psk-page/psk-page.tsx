import { Chapter } from "../../interfaces/Chapter";
import { scrollToElement, createCustomEvent } from "../../utils/utils";
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

		this._checkForChapterScrolling();
	}

	render() {
		document.addEventListener('pageScroll', this.handleScrollEvent.bind(this), true);

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

	handleScrollEvent(evt: PskScrollEvent) {
		evt.preventDefault();
		evt.stopImmediatePropagation();

		const scrollSectionElement: HTMLElement = evt.parentEventData
			&& evt.parentEventData as HTMLElement;
		if (!scrollSectionElement) {
			return;
		}

		this.activeChapter = null;
		let foundChapterId: string = null;
		let lastChapterVerticalOffset: number = 0;

		let chapterList: Array<HTMLElement> = Array.from(this.element.querySelectorAll('psk-chapter'));
		chapterList.forEach((chapter: HTMLElement) => {
			if (foundChapterId !== null || this.activeChapter !== null) {
				return;
			}

			const chapterId: string = chapter.getAttribute('guid');
			if (!chapterId) {
				return;
			}

			const child: HTMLElement = chapter.getElementsByClassName('card psk-card')
				&& chapter.getElementsByClassName('card psk-card')[0] as HTMLElement;

			let chapterVerticalOffset: number = 0;
			if (lastChapterVerticalOffset >= child.offsetTop) {
				chapterVerticalOffset = lastChapterVerticalOffset + child.offsetTop;
			} else {
				chapterVerticalOffset = child.offsetTop;
			}

			const pageVerticalOffset: number = scrollSectionElement.scrollTop;

			if (pageVerticalOffset >= lastChapterVerticalOffset
				&& pageVerticalOffset <= chapterVerticalOffset) {
				foundChapterId = chapterId;
				this.activeChapter = foundChapterId;
			}

			lastChapterVerticalOffset = chapterVerticalOffset;
		});

		if (chapterList.length > 0) {
			this.activeChapter = foundChapterId
				? foundChapterId
				: chapterList[0].getAttribute('guid');
		}
	}
}