import { Component, h, Prop, Element, State } from "@stencil/core";
import { PSK_LIST_PARSE_CONFIG } from "../../utils/constants";

@Component({
    tag: "psk-list",
    styleUrl: "./page.css"
})

export class PskList {

    @Prop() listType: string;
    @State() listContent: any = null;
    @Element() private element: HTMLElement;

    render() {
        // if (!this.listType) {
        //     return;
        // }

        // if (this.listContent) {
        //     if (this.listType === LIST_TYPE_NUMERIC) {
        //         return <ol>{this.listContent}</ol>;
        //     }
        //     if (this.listType === LIST_TYPE_NOT_NUMERIC) {
        //         return <ul>{this.listContent}</ul>;
        //     }
        // }
        return <ul>{this.listContent}</ul>
    }

    componentWillLoad() {

        const htmlLines: Array<string> = this.element.innerHTML
            .split(/\n/g)
            .map(el => el.trim())
            .filter(el => el.length > 0 && el !== '<!---->');

        if (htmlLines.length === 0) {
            return;
        }

        const finalHtmlLines = [];

        let withChild: boolean = false,
            currentChildTagName: string = null,
            sameChildDepthLevel: number = 0,
            currentChildListItem: string = '';

        // const _getHtmlElementForString = (line: string) => {
        //     const doc = new DOMParser().parseFromString(line, 'text/html');
        //     return doc.body.children;
        // };

        htmlLines.forEach((line: string) => {
            console.log(line, withChild, currentChildTagName, currentChildListItem, sameChildDepthLevel);
            let match = PSK_LIST_PARSE_CONFIG.startTag.exec(line);
            if (match !== null) {
                withChild = true;
                currentChildListItem += line;
                if (currentChildTagName === match[0]) {
                    sameChildDepthLevel++;
                } else if (!currentChildTagName) {
                    currentChildTagName = match[0];
                }
            } else {
                match = PSK_LIST_PARSE_CONFIG.endTag.exec(line);
                if (match !== null) {
                    currentChildListItem += line;
                    if (currentChildTagName === match[0].replace(/\//g, '')) {
                        if (sameChildDepthLevel === 0) {
                            finalHtmlLines.push(<li>{currentChildListItem}</li>);
                            currentChildTagName = null;
                            currentChildListItem = '';
                        } else {
                            sameChildDepthLevel--;
                        }
                    }
                }
                else {
                    if (withChild) {
                        currentChildListItem += line;
                    } else {
                        finalHtmlLines.push(<li>{line}</li>);
                    }
                }
            }
        });
        this.element.innerHTML = '';
        this.listContent = finalHtmlLines;
    }
}
