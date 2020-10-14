import { Component, Element, Prop, Host, h } from '@stencil/core';

import CustomTheme from '../../../decorators/CustomTheme';
import { applyStyles, generateRule } from '../psk-layout.utils';

@Component({
  tag: 'psk-layout-item',
  shadow: true
})

export class PskLayoutItem {
  @CustomTheme()

  @Element() private __host: HTMLElement;

  @Prop() column: string | null = null;
  @Prop() columnStart: string | null = null;
  @Prop() columnEnd: string | null = null;

  @Prop() row: string | null = null;
  @Prop() rowStart: string | null = null;
  @Prop() rowEnd: string | null = null;

  @Prop() align: string | null = null;
  @Prop() alignX: string | null = null;
  @Prop() alignY: string | null = null;

  async componentWillLoad() {
    const styles = generateRule(':host', this.__getProperties());
    applyStyles(this.__host, styles);
  }

  __getProperties() {
    const properties = {};

    if (this.column) properties['grid-column'] = this.column;
    if (this.columnStart) properties['grid-column-start'] = this.columnStart;
    if (this.columnEnd) properties['grid-column-end'] = this.columnEnd;

    if (this.row) properties['grid-row'] = this.row;
    if (this.rowStart) properties['grid-row-start'] = this.rowStart;
    if (this.rowEnd) properties['grid-row-end'] = this.rowEnd;

    if (this.align) properties['place-self'] = this.align;
    if (this.alignX) properties['justify-self'] = this.alignX;
    if (this.alignY) properties['align-self'] = this.alignY;

    return properties;
  }

  render() {
    return (
      <Host>
        <slot/>
      </Host>
    )
  }
}
