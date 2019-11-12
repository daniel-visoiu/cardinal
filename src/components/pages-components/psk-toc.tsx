import { Component, h, Prop, State, getElement, Listen } from '@stencil/core';
import { closestParentElement, scrollToElement } from '../../utils/utils';
import { Chapter } from '../../interfaces/Chapter';

@Component({
    tag: 'psk-toc',
    styleUrl: './page.css'
})
export class PskToc {

    @Prop() title: string;
    @State() pskPageElement: HTMLElement;
    @State() chapterList: Array<Chapter> = [];

    connectedCallback() {
        this.pskPageElement = closestParentElement(getElement(this), 'psk-page');
    }

    @Listen('psk-send-toc', { target: "document" })
    tocReceived(evt: CustomEvent) {
        if (evt.detail) {
            this.chapterList = this._sortChapters([...evt.detail]);
        }
    }

    _sortCurrentChapter(chapter: Chapter, guidOrderedList: Array<string>): Chapter {
        if (chapter.children.length === 0) {
            return chapter;
        }

        let newChildren: Array<Chapter> = [];
        for (let index = 0; index < guidOrderedList.length; ++index) {
            let ch: Chapter = chapter.children.find((el: Chapter) => el.guid === guidOrderedList[index]);
            if (ch) {
                guidOrderedList.splice(index--, 1);
                newChildren.push(this._sortCurrentChapter(ch, guidOrderedList));
            }
        }

        return {
            ...chapter,
            children: newChildren
        };
    }

    _sortChapters(chapters: Array<Chapter>): Array<Chapter> {
        const chaptersInsidePage = this.pskPageElement.querySelectorAll('psk-chapter');
        const guidOrderedList: Array<string> = [];
        chaptersInsidePage.forEach((chapter: HTMLElement) => {
            if (chapter.hasAttribute('guid')) {
                guidOrderedList.push(chapter.getAttribute('guid'));
            }
        });

        let newChapters: Array<Chapter> = [];

        for (let index = 0; index < guidOrderedList.length; ++index) {
            let ch: Chapter = chapters.find((el: Chapter) => el.guid === guidOrderedList[index]);
            if (ch) {
                guidOrderedList.splice(index--, 1);
                newChapters.push(this._sortCurrentChapter(ch, guidOrderedList));
            }
        }

        return newChapters;
    }

    _renderChapters(pageElement: HTMLElement, chapters: Array<Chapter>, childrenStartingIndex?: string): Array<HTMLElement> {
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
        return (
            <div class="table-of-content">
                <psk-card title={this.title}>
                    <ul>{this._renderChapters(this.pskPageElement, this.chapterList)}</ul>
                </psk-card>
            </div>
        );
    }
}