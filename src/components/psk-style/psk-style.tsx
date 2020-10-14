import { Component, Element, Prop, h } from '@stencil/core';

import { applyStyles } from './psk-style.utils';

@Component({
  tag: 'psk-style',
  styleUrl: './styles/psk-style.default.css',
  shadow: true
})

export class PskStyle {
  private __styles: string = ''
  private __styledElement: HTMLElement;

  @Element() private __host: HTMLElement;

  @Prop() src: string | null = null;

  async componentWillLoad() {
    let valid: boolean;

    if (this.__host.innerText) {
      this.__styles = this.__host.innerText;
    }

    // TODO: src prop
    // a import file, read it, apply styles

    if (this.__host.parentElement && this.__host.parentElement.shadowRoot) {
      this.__styledElement = this.__host.parentElement;
      valid = true;
    } else {
      // TODO: what to do?
      // find the first element with shadow root?
      // apply inline styling for parentElement?
      // how long can be inline tagging?
      // should be made any for shadowed parents?
      // then console.error?
      valid = false;
    }

    if (valid) {
      console.log(this.__styles);
      applyStyles(this.__styledElement, this.__styles);
    }
  }

  render() {
    return (
      <style>
        <slot/>
      </style>
    );
  }
}
