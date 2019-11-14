import { Component, h, Prop, Element } from "@stencil/core";
import { closestParentElement, scrollToElement } from "../../utils/utils";
import { TOOLTIP_TEXT, TOOLTIP_COPIED_TEXT } from "../../utils/constants";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
    tag: "psk-copy-clipboard",
})

export class PskCard {

    @CustomTheme()

    @TableOfContentProperty({
        description: `This property is the id of the textzone that will be copied to the clipboard.`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() id: string = "";


    @Element() private element: HTMLElement;

    _copyToClipboardHandler(elementId: string): void {
        try {
            let basePath = window.location.href;
            if (window.location.href.indexOf("?chapter=") !== -1) {
                basePath = window.location.href.split("?chapter=")[0];
            }

            navigator.clipboard.writeText(`${basePath}?chapter=${elementId}`);

            const tooltipTextArea: HTMLElement = this.element.querySelector('.tooltip');
            tooltipTextArea.innerHTML = TOOLTIP_COPIED_TEXT;
            tooltipTextArea.setAttribute("class", "tooltip copied");

            scrollToElement(elementId, closestParentElement(this.element, 'psk-page'));

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