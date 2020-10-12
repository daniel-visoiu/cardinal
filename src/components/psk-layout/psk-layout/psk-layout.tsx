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

  @Prop() templateColumns: string | null = null;
  @Prop() templateRows: string | null = null;

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
    if (this.templateRows) properties['grid-template-columns'] = this.templateRows;
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
        <slot></slot>
      </Host>
    )
  }
}
