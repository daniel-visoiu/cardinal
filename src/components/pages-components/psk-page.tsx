import { Component, h, Prop, Listen, State, Element } from "@stencil/core";
import { Chapter } from "../../interfaces/Chapter";

@Component({
	tag: "psk-page",
	styleUrl: "./page.css",
	shadow: true
})

export class PskPage {

	@State() chapters: Array<Chapter> = [];

	@Prop() title: string = "";
	@Prop() tableOfContentTitle: string;

	@Element() private element: HTMLElement;

	@Listen("psk-send-chapter")
	receiveChapters(evt: CustomEvent) {
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
			this.chapters = [...tempChapter];
			return;
		}

		tempChapter[chapterIndex] = {
			...newChapter,
		};
		this.chapters = [...tempChapter];
	}

	render() {
		return (
			<div>
				<nav><h3>{this.title}</h3></nav>
				<div class="table-of-content">
					<psk-toc
						pageElement={this.element}
						chapterList={this.chapters}
						title={this.tableOfContentTitle} />
				</div>
				<div class="page-content">
					<slot />
				</div>
			</div>
		)
	}
}
