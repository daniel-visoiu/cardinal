import { Component, h, Listen, State } from '@stencil/core';
import { Chapter } from '../../interfaces/Chapter';

@Component({
    tag: 'psk-toc',
    styleUrl: './page.css'
})
export class PskToc {

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
                index: this.chapters.length + 1
            });
            this.chapters = [...tempChapter];
            return;
        }

        tempChapter[chapterIndex] = {
            ...newChapter,
            index: tempChapter[chapterIndex].index
        };
        this.chapters = [...tempChapter];
    }

    @State() chapters: Array<Chapter> = [];

    renderChapters(chapters: Array<Chapter>) {
        console.log(chapters, 'chapters....');
        return chapters.map((chapter: Chapter) => {
            return (
                <li id={chapter.guid}>
                    <h6>{chapter.index ? `#${chapter.index}. ` : ''} {chapter.data}</h6>
                    {chapter.children.length === 0 ? null : <ul>{this.renderChapters(chapter.children)}</ul>}
                </li>
            );
        });
    }

    render() {
        return (
            <psk-card title="Table of Contents">
                <ul>
                    {this.renderChapters(this.chapters)}
                </ul>
            </psk-card>
        );
    }
}
