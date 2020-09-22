import { Component, h, Prop, Element } from "@stencil/core";
import { PSK_LIST_PARSE_CONFIG, LIST_TYPE_ORDERED } from "../../utils/constants";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import CustomTheme from "../../decorators/CustomTheme";
import {getInnerHTML} from "../../utils/utilFunctions";

@Component({
    tag: "psk-list",
    styleUrl:"../../assets/css/bootstrap/bootstrap.min.css"
})
export class PskList {
    @CustomTheme()

    @TableOfContentProperty({
        description: [`This property gives the type of the list. It has two type of values, "ordered" or "unordered"`,
            `If this property is missing, "unordered is assumed"`],
        isMandatory: false,
        propertyType: 'string',
        defaultValue: `unordered`
    })
    @Prop() listType: string;
    @Element() private element: HTMLElement;

    render() {
        let htmlLinesRaw = "";
        htmlLinesRaw = getInnerHTML(this);
        if(!htmlLinesRaw){
          return null;
        }
        const htmlLines: Array<string> = htmlLinesRaw.split(/\n/g).filter(el => el.trim().length > 0);

        if (htmlLines.length === 0) {
            return null;
        }

        let finalHtmlLines = [];
        let currentTag = null;
        let currentListItem = '';

        // @ts-ignore --Typescript does not recognize trimLeft!?
        const trimmedLine = htmlLines[0].trimLeft();
        const offset = htmlLines[0].length - trimmedLine.length;

        for (let index = 0; index < htmlLines.length; index++) {
            let line = htmlLines[index];

            // @ts-ignore --Typescript does not recognize trimLeft!?
            const currentTrimmedLine = line.trimLeft();
            const currentLineOffset = line.length - currentTrimmedLine.length;

            /**
             * If the left trim offset is not the same with the first line,
             * it means that this line is part of the current list item.
             */
            if (offset !== currentLineOffset) {
                currentListItem += `${line}\n`;
                continue;
            }
            line = line.substring(offset);

            if (line.split('')[0] !== '<') {
                if (currentListItem !== '') {
                    finalHtmlLines.push(`${currentListItem}</li>`);
                }

                currentListItem = `<li>${line}`;
                continue;
            } else if (currentListItem !== '') {
                finalHtmlLines.push(`${currentListItem}</li>`);
                currentListItem = '';
            }

            /**
             * Check if first character is "<", which brings a component or an HTML tag.
             * It can be the start of a tag, the end of a tag, or an inline tag (e.g. <code>Text</code>)
             */
            const inlineMatch = PSK_LIST_PARSE_CONFIG.inlineTag.exec(line);
            if (inlineMatch !== null) {
                finalHtmlLines.push(`<li>${line}</li>`);
                continue;
            }

            const startMatch = PSK_LIST_PARSE_CONFIG.startTag.exec(line);
            if (startMatch !== null && !currentTag) {
                currentTag = startMatch[1];
                currentListItem = `<li>${line}`;
                continue;
            }

            const endMatch = PSK_LIST_PARSE_CONFIG.endTag.exec(line);
            if (endMatch !== null && currentTag === endMatch[1]) {
                finalHtmlLines.push(`${currentListItem}${line}</li>`);

                currentTag = null;
                currentListItem = '';
                continue;
            }
        }

        if (currentListItem !== '') {
            finalHtmlLines.push(currentListItem);
        }

        this.element.innerHTML = '';

        if (this.listType === LIST_TYPE_ORDERED) {
            return <ol innerHTML={finalHtmlLines.join('\n')} />;
        }

        return <ul innerHTML={finalHtmlLines.join('\n')} />;
    }
}
