import { Component, h, Prop, Element } from "@stencil/core";
import { closestParentElement, scrollToElement } from "../../utils/utils";
import { TOOLTIP_TEXT, TOOLTIP_COPIED_TEXT } from "../../utils/constants";
import { RouterHistory, injectHistory } from "@stencil/router";

@Component({
    tag: "psk-copy-clipboard",
    styleUrl: './page.css'
})

export class PskCard {

    @Prop() id: string = "";
    @Prop() history: RouterHistory;
    @Element() private element: HTMLElement;

    _copyToClipboardHandler(elementId: string): void {
        try {
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${elementId}`);

            const tooltipTextArea: HTMLElement = this.element.querySelector('.tooltip');
            tooltipTextArea.innerHTML = TOOLTIP_COPIED_TEXT;
            tooltipTextArea.setAttribute("class", "tooltip copied");

            scrollToElement(elementId, closestParentElement(this.element, 'psk-page'), this.history);

        } catch (err) {
            console.error(err);
        }
    }

    _resetTooltip(): void {
        const tooltipTextArea: HTMLElement = this.element.querySelector('.tooltip');
        tooltipTextArea.innerHTML = TOOLTIP_TEXT;
        tooltipTextArea.setAttribute("class", "tooltip");
    }

    _isCopySupported(): boolean {
        let support: boolean = !!document.queryCommandSupported;

        ['copy', 'cut'].forEach((action) => {
            support = support && !!document.queryCommandSupported(action);
        });
        return support;
    }

    render() {

        const elementId = this.id.trim().replace(/( |:|\/|\.)/g, "-").toLowerCase();
        if (elementId.length === 0 || !this._isCopySupported()) {
            return;
        }

        return (
            <div id="tooltip"
                onClick={(evt: MouseEvent) => {
                    evt.stopImmediatePropagation();
                    this._copyToClipboardHandler(elementId);
                }}
                onMouseOut={() => {
                    this._resetTooltip();
                }}>
                <a class="mark"
                    href={`#${elementId}`}
                    onClick={(evt: MouseEvent) => {
                        evt.preventDefault();
                    }} >
                    <slot />
                </a>
                <span class="tooltip">{TOOLTIP_TEXT}</span>
            </div>
        )
    }
}

injectHistory(PskCard);