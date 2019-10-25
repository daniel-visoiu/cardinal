import { Component, h, Prop } from '@stencil/core';
import { Chapter } from '../../interfaces/Chapter';

@Component({
    tag: 'psk-toc',
    styleUrl: './page.css'
})
export class PskToc {

    @Prop() title: string;
    @Prop() pageElement: HTMLElement;
    @Prop() chapterList: Array<Chapter> = [];

    _scrollToChapter(chapterTitle: string): void {
        const selector = '#' + chapterTitle.replace(/ /g, "_").toLowerCase();
        const chapterElm = this.pageElement.querySelector(selector);

        if (!chapterElm) {
            return;
        }

        chapterElm.scrollIntoView({
            behavior: 'smooth'
        });
    }

    _renderChapters(chapters: Array<Chapter>, childrenStartingIndex?: string) {
        return chapters.map((chapter: Chapter, index: number) => {
            let indexToDisplay = childrenStartingIndex === undefined
                ? `${index + 1}.`
                : `${childrenStartingIndex}${index + 1}.`;

            return (
                <li onClick={(evt: MouseEvent) => {
                    evt.stopImmediatePropagation();
                    evt.preventDefault();
                    this._scrollToChapter(chapter.title);
                }}>
                    <span>{`${indexToDisplay} ${chapter.title}`}</span>
                    {
                        chapter.children.length === 0 ? null
                            : <ul>{this._renderChapters(chapter.children, indexToDisplay)}</ul>
                    }
                </li>
            );
        });
    }

    render() {
        return (
            <psk-card title={this.title}>
                <ul>{this._renderChapters(this.chapterList)}</ul>
            </psk-card>
        );
    }
}
