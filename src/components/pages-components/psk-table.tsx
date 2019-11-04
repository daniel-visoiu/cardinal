import { Component, h, Element, State, Prop } from "@stencil/core";

@Component({
    tag: "psk-table",
    styleUrl: "./page.css"
})
export class PskTable {

    @Prop() head: boolean;
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