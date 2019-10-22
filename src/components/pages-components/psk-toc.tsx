import { Component, h, Listen, State } from '@stencil/core';

@Component({
    tag: 'psk-toc',
    styleUrl: './page.css'
})
export class PskToc {

    @State() chapters: Array<any> = [];

    @Listen("psk-send-chapter")
    receivedChapter(evt: CustomEvent) {
        evt.stopImmediatePropagation();
        if (evt.detail) {
            this.chapters.push({ ...evt.detail });
        }
    }

    render() {
        console.log("[INSIDE PSK-TOC COMPONENT]");
        console.log(this.chapters);
        console.log("[INSIDE PSK-TOC COMPONENT]");

        return null;
            /*<psk-chapter title="Table of Contents">

            </psk-chapter>*/

    }
}
