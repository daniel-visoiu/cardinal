import { Component, h, Element, State, Prop } from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";

@Component({
  tag: "psk-table",
  shadow:true
})
export class PskTable {
    @CustomTheme()

    @TableOfContentProperty({
        description: `If this property is set to true then the first row of the given content will be shown as a table header.`,
        isMandatory: false,
        propertyType: `boolean`
    })
    @Prop() head: boolean;

    @TableOfContentProperty({
        description: `If this property is set to true then the last row of the given content will be shown as a table footer.`,
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
            .map((line: string,index:number) => {
                let tableRow: string = line
                    .split('|')
                    .map(el => {
                        if (this.head && index === 0) {
                            return `<th>${el.trim()}</th>`;
                        } else {
                            return `<td>${el.trim()}</td>`;
                        }
                    }).join('');
                return `<tr>${tableRow}</tr>`;
            });
        let finalTableRows: Array<HTMLElement> = [];
        if (this.head) {
            finalTableRows.push(this._stringArrayToHTMLElement('thead', tableRows.splice(0, 1)));
            if (this.footer) {
                finalTableRows.push(this._stringArrayToHTMLElement('tbody', tableRows.splice(0, tableRows.length - 1)));
                finalTableRows.push(this._stringArrayToHTMLElement('tfoot', [tableRows[tableRows.length - 1]]));
            } else {
                finalTableRows.push(this._stringArrayToHTMLElement('tbody', tableRows.splice(0)));
            }
        } else {
            finalTableRows = [this._stringArrayToHTMLElement('tbody', tableRows)];
        }
        this.tableContent = finalTableRows;
        this.element.innerHTML = '';
    }

    _stringArrayToHTMLElement(tag: string, html: Array<string>): HTMLElement {
        const HTMLTag = tag;
        return <HTMLTag innerHTML={html.join('')}></HTMLTag>;
    }
}
