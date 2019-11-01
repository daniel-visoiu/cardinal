import { Component, h, Prop, Element, State } from "@stencil/core";
import { PSK_LIST_PARSE_CONFIG, LIST_TYPE_NUMERIC } from "../../utils/constants";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
    tag: "psk-list",
    styleUrl: "./page.css"
})

export class PskList {

    @TableOfContentProperty({
        description: [`This property gives the type of the list. It has two type of values, "numeric" or "bullet"`,
            `If this property is missing, "bullet is assumed"`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() listType: string;
    @State() listContent = null;
    @Element() private element: HTMLElement;

    render() {
        if (this.listType === LIST_TYPE_NUMERIC) {
            return <ol>
                {this.listContent}
            </ol>;
        }

        return <ul>
            {this.listContent}
        </ul>;
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

        htmlLines.forEach((line: string) => {
            let inlineTagMatch = PSK_LIST_PARSE_CONFIG.inlineTag.exec(line);
            if (inlineTagMatch !== null) {
                if (withChild) {
                    currentChildListItem += line;
                } else {
                    finalHtmlLines.push(this._htmlToElement('li', line));
                }
            } else {
                let startTagMatch = PSK_LIST_PARSE_CONFIG.startTag.exec(line);
                if (startTagMatch !== null) {
                    withChild = true;
                    currentChildListItem += line;
                    if (currentChildTagName === startTagMatch[0]) {
                        sameChildDepthLevel++;
                    } else if (!currentChildTagName) {
                        currentChildTagName = startTagMatch[0];
                    }
                } else {
                    let endTagMatch = PSK_LIST_PARSE_CONFIG.endTag.exec(line);
                    if (endTagMatch !== null) {
                        currentChildListItem += line;
                        if (currentChildTagName === endTagMatch[0].replace(/\//g, '')) {
                            if (sameChildDepthLevel === 0) {
                                finalHtmlLines.push(this._htmlToElement('li', currentChildListItem));
                                currentChildTagName = null;
                                currentChildListItem = '';
                                withChild = false;
                            } else {
                                sameChildDepthLevel--;
                            }
                        }
                    }
                    else {
                        if (withChild) {
                            currentChildListItem += line;
                        } else {
                            finalHtmlLines.push(this._htmlToElement('li', line));
                        }
                    }
                }
            }
        });

        this.element.innerHTML = '';
        this.listContent = [...finalHtmlLines];
    }

    _htmlToElement(tag: string, html: string): HTMLElement {
        const HTMLTag = tag;
        return <HTMLTag innerHTML={html}></HTMLTag>;
    }
}