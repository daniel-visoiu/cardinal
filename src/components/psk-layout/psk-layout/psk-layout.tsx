import { Component, Element, Prop, Host, h} from '@stencil/core';

import CustomTheme from '../../../decorators/CustomTheme';
import { applyStyles, generateRule } from './psk-layout.utils';

@Component({
  tag: 'psk-layout',
  shadow: true
})

export class PskLayout {
  @CustomTheme()

  @Element() private __host: HTMLElement;

  @Prop() columns: number | null = null;
  @Prop() rows: number | null = null;

  @Prop() templateColumns: string | null = null;
  @Prop() templateRows: string | null = null;

  @Prop() autoFlow: string | null = null;
  @Prop() autoColumns: string | null = null;
  @Prop() autoRows: string | null = null;

  @Prop() gap: string | null = null;
  @Prop() columnGap: string | null = null;
  @Prop() rowGap: string | null = null;

  @Prop() alignItems: string | null = null;
  @Prop() alignItemsX: string | null = null;
  @Prop() alignItemsY: string | null = null;

  @Prop() alignContent: string | null = null;
  @Prop() alignContentX: string | null = null;
  @Prop() alignContentY: string | null = null;

  async componentWillLoad() {
    const styles = generateRule(':host', this.__getProperties());
    applyStyles(this.__host, styles);
  }

  __getProperties() {
    const properties = { 'display': 'grid' };

    if (this.templateColumns) properties['grid-template-columns'] = this.templateColumns;
    else if (this.columns) properties['grid-template-columns'] = `repeat(${this.columns}, 1fr)`;

    if (this.templateRows) properties['grid-template-rows'] = this.templateRows;
    else if (this.rows) properties['grid-template-rows'] = `repeat(${this.rows}, 1fr)`;

    if (this.autoFlow) properties['grid-auto-flow'] = this.templateRows;
    if (this.autoColumns) properties['grid-auto-columns'] = this.templateRows;
    if (this.autoRows) properties['grid-auto-rows'] = this.templateRows;

    if (this.gap) properties['gap'] = this.gap;
    if (this.columnGap) properties['column-gap'] = this.columnGap;
    if (this.rowGap) properties['row-gap'] = this.rowGap;

    if (this.alignItems) properties['place-items'] = this.alignItems;
    if (this.alignItemsX) properties['justify-items'] = this.alignItemsX;
    if (this.alignItemsY) properties['align-items'] = this.alignItemsY;

    if (this.alignContent) properties['place-content'] = this.alignContent;
    if (this.alignContentX) properties['justify-content'] = this.alignContentX;
    if (this.alignContentY) properties['align-content'] = this.alignContentY;

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
