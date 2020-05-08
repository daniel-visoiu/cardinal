import { Component, h, Prop, State, getElement, Listen } from '@stencil/core';
import { closestParentElement, scrollToElement } from '../../utils/utilFunctions';
import { Chapter } from '../../interfaces/Chapter';
import CustomTheme from '../../decorators/CustomTheme';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';

@Component({
    tag: 'psk-toc',
})
export class PskToc {
    @CustomTheme()

    @TableOfContentProperty({
        description: `This property is the title of the psk-card that will be created.`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() title: string;
    @State() pskPageElement: HTMLElement;
    @State() activeChapter: string = null;
    @State() chapterList: Array<Chapter> = [];
    @State() initialChapterSetupDone: boolean = false;

    connectedCallback() {
        this.pskPageElement = closestParentElement(getElement(this), 'psk-page');
    }

    @Listen('psk-send-toc', { target: "document" })
    tocReceived(evt: CustomEvent) {
        if (evt.detail) {
            let { chapters, active } = evt.detail;

            this.chapterList = this._sortChapters(chapters);
            this.activeChapter = active;
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
            if (!(chapter.hasAttribute('data-define-props') || chapter.hasAttribute('data-define-controller') || chapter.hasAttribute('data-define-events')) && (chapter.hasAttribute('guid'))) {
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
                <li class={chapter.guid === this.activeChapter?"toc-item active":"toc-item"}
                    onClick={(evt: MouseEvent) => {
                        evt.stopImmediatePropagation();
                        evt.preventDefault();
                        scrollToElement(chapter.title, pageElement);
                        this.activeChapter = chapter.guid;
                    }}>
                    <span class="chapter-index">{indexToDisplay}</span><span class="chapter-title">{chapter.title}</span>
                    {
                        chapter.children.length === 0 ? null
                            : <ul>{this._renderChapters(pageElement, chapter.children, indexToDisplay)}</ul>
                    }
                </li>
            );
        });
    }

    render() {
        if ((!this.initialChapterSetupDone || !this.activeChapter)
            && this.chapterList.length > 0) {
            this.activeChapter = this.chapterList[0].guid;
            this.initialChapterSetupDone = true;
        }

        return (
            <div class="table-of-content">
                <psk-card title={this.title}>
                    <ul>{this._renderChapters(this.pskPageElement, this.chapterList)}</ul>
                </psk-card>
            </div>
        );
    }
}
