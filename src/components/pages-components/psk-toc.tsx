import { Component, h, Prop, Listen, State, getElement } from '@stencil/core';
import { Chapter } from '../../interfaces/Chapter';
import { scrollToElement, closestParentElement } from '../../utils/utils';

@Component({
    tag: 'psk-toc',
    styleUrl: './page.css'
})
export class PskToc {

    @Prop() title: string;
    @State() chapterList: Array<Chapter> = [];

    @Listen('psk-send-toc', { target: "document" })
    tocReceived(evt: CustomEvent) {
        if (evt.detail) {
            this.chapterList = [...evt.detail];
        }
    }

    _renderChapters(pageElement: HTMLElement, chapters: Array<Chapter>, childrenStartingIndex?: string) {
        return chapters.map((chapter: Chapter, index: number) => {
            let indexToDisplay = childrenStartingIndex === undefined
                ? `${index + 1}.`
                : `${childrenStartingIndex}${index + 1}.`;

            return (
                <li onClick={(evt: MouseEvent) => {
                    evt.stopImmediatePropagation();
                    evt.preventDefault();
                    scrollToElement(chapter.title, pageElement);
                }}>
                    <span>{`${indexToDisplay} ${chapter.title}`}</span>
                    {
                        chapter.children.length === 0 ? null
                            : <ul>{this._renderChapters(pageElement, chapter.children, indexToDisplay)}</ul>
                    }
                </li>
            );
        });
    }

    render() {
        const pskPageElement = closestParentElement(getElement(this), 'psk-page');

        return (
            <div class="table-of-content">
                <psk-card title={this.title}>
                    <ul>{this._renderChapters(pskPageElement, this.chapterList)}</ul>
                </psk-card>
            </div>
        );
    }
}
