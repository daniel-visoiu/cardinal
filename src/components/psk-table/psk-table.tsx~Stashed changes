import { Component, h, Element, State, Prop } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
    tag: "psk-table"
})
export class PskTable {
    @CustomTheme()

    @TableOfContentProperty({
        description: `If this property is set as true then the table will have a footer in which the first info of the table will be written. `,
        isMandatory: false,
        propertyType: `boolean`
    })
    @Prop() head: boolean;

    @TableOfContentProperty({
        description: `If this property is set as true then the table will have a footer in which the last info of the table will be written.`,
        isMandatory: false,
        propertyType: `boolean`
    })
    @Prop() footer: boolean;

    @Element() private element: HTMLElement;
    @State() tableContent: Array<HTMLElement> = null;

    render() {
        return <table>
            {this.tableContent}
        </table>;
    }

    componentWillLoad() {
        let tableRows = this.element.innerHTML
            .split(/\n/g)
            .map(el => el.trim().replace('<!---->', ''))
            .filter(el => el.length > 0)
            .map((line: string) => {
                let tableRow: string = line
                    .split('|')
                    .map(el => {
                        if (this.head) {
                            return `<th>${el.trim()}</th>`;
                        } else {
                            return `<td>${el.trim()}</td>`;
                        }
                    }).join('');
                return `<tr>${tableRow}</tr>`;
            });
        let finalTableRows: Array<HTMLElement> = [];
        if (this.head) {
            finalTableRows.push(this._htmlToElement('thead', tableRows.splice(0, 1)));
            if (this.footer) {
                finalTableRows.push(this._htmlToElement('tbody', tableRows.splice(0, tableRows.length - 2)));
                finalTableRows.push(this._htmlToElement('tfoot', [tableRows[tableRows.length - 1]]));
            } else {
                finalTableRows.push(this._htmlToElement('tbody', tableRows.splice(0)));
            }
        } else {
            finalTableRows = [this._htmlToElement('tbody', tableRows)];
        }
        this.tableContent = finalTableRows;
        this.element.innerHTML = '';
    }

    _htmlToElement(tag: string, html: Array<string>): HTMLElement {
        const HTMLTag = tag;
        return <HTMLTag innerHTML={html.join('')}></HTMLTag>;
    }
}