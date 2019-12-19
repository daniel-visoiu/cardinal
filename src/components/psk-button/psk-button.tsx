import {Component, h, Prop, Element} from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';
import PskButtonEvent from "../../events/PskButtonEvent";

const ACCEPTED_DEFAULT_DISPATCHERS = [document, window];

@Component({
  tag: 'psk-button',
  shadow: true
})
export class PskButton {
  @CustomTheme()

  @Prop() label: string | null = null;
  @Prop() buttonClass: string | null = "btn btn-primary";
  @Prop() eventName: string | null = null;
  @Prop() eventData: any | null = null;
  @Prop() disabled: boolean = false;
  @Element() htmlElement: HTMLElement;
  @Prop() eventDispatcher: string;

  render() {
    return (
      <button onClick={(evt: MouseEvent) => {
        if (this.eventName) {
          evt.preventDefault();
          evt.stopImmediatePropagation();

          let pskButtonEvent = new PskButtonEvent(this.eventName, this.eventData, {
            bubbles: true,
            composed: true,
            cancelable: true
          });

          let eventDispatcherElement = this.htmlElement;
          if (this.eventDispatcher) {
            if (ACCEPTED_DEFAULT_DISPATCHERS.indexOf(window[this.eventDispatcher]) !== -1) {
              eventDispatcherElement = window[this.eventDispatcher];
            }
          }
          eventDispatcherElement.dispatchEvent(pskButtonEvent);
        }
      }} class={this.buttonClass}
              disabled={this.disabled}>
        {this.label && this.label}
        <slot/>
      </button>
    );
  }
}
