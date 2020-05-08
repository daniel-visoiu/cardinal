import { Component, h, Prop, Element, Event, EventEmitter, State } from "@stencil/core";
import {closestParentElement, normalizeElementId, scrollToElement} from "../../utils/utilFunctions";
import {TOOLTIP_TEXT, TOOLTIP_COPIED_TEXT} from "../../utils/constants";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import CustomTheme from "../../decorators/CustomTheme";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";

@Component({
  tag: "psk-copy-clipboard",
})

export class PskCopyClipboard {

  @CustomTheme()

  @TableOfContentEvent({
    eventName: `getHistoryType`,
    controllerInteraction: {
      required: true
    },
    description: `This event gets the history type in order to see what identificator to use for the selected chapter Token.
                  The three types of token that can be returned are : browser, hash or query.`
  })
  @Event({
    eventName: 'getHistoryType',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getHistoryType: EventEmitter;

  @TableOfContentProperty({
    description: `This property is the id of the textzone that will be copied to the clipboard.
                  It is necessary (but not mandatory) so the URL can be copied in a simplified fashion.
                  Special characters(Example : ':','/') will be replaced with dash('-').`,
    isMandatory: false,
    propertyType: `string`
  })
  @Prop() id: string = "";

  @State() chapterToken = "";

  componentWillLoad() {
    this.getHistoryType.emit((err, historyType) => {
      if (err) {
        console.log(err);
        return;
      }
      switch (historyType) {
        case "browser":
        case "hash":
          this.chapterToken = "?chapter=";
          break;
        case "query":
          this.chapterToken = "&chapter=";
          break;
      }
    })
  }

  @Element() private element: HTMLElement;

  _copyToClipboardHandler(elementId: string): void {
    try {
      let basePath = window.location.href;
      if (window.location.href.indexOf(this.chapterToken) !== -1) {
        basePath = window.location.href.split(this.chapterToken)[0];
      }
      navigator.clipboard.writeText(`${basePath}${this.chapterToken}${elementId}`);
      const tooltipTextArea: HTMLElement = this.element.querySelector('.copy-tooltip');
      tooltipTextArea.innerHTML = TOOLTIP_COPIED_TEXT;
      tooltipTextArea.setAttribute("class", "copy-tooltip copied");

      scrollToElement(elementId, closestParentElement(this.element, 'psk-page'));

    } catch (err) {
      console.error(err);
    }
  }

  _resetTooltip(): void {
    const tooltipTextArea: HTMLElement = this.element.querySelector('.copy-tooltip');
    tooltipTextArea.innerHTML = TOOLTIP_TEXT;
    tooltipTextArea.setAttribute("class", "copy-tooltip");
  }

  _isCopySupported(): boolean {
    let support: boolean = !!document.queryCommandSupported;

    ['copy', 'cut'].forEach((action) => {
      support = support && !!document.queryCommandSupported(action);
    });
    return support;
  }

  render() {

    const elementId = normalizeElementId(this.id.trim());
    if (elementId.length === 0 || !this._isCopySupported()) {
      return;
    }

    return (
      <div class="tooltip_container"
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
          }}>
          <slot />
        </a>
        <span class="copy-tooltip">{TOOLTIP_TEXT}</span>
      </div>
    )
  }
}
