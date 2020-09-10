import { Component, Prop, Host, h } from '@stencil/core';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
  tag: 'psk-details',
  shadow: true
})

export class PskDetails {

  @CustomTheme()

  @Prop() opened: boolean;

  @Prop() summary: string;

  detailToggle(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.opened = !this.opened;
  }

  render() {
    return (
      <Host opened={ this.opened }>
        <div class={{ 'summary': true }} tabindex={0} onClick={(e: Event) => this.detailToggle(e)}>
          <psk-icon icon={ this.opened ? 'chevron-down' : 'chevron-right' }></psk-icon>
          <span>{ this.summary }</span>
        </div>
        { this.opened
          ? <div class={{ 'content': true }}>
            <slot />
          </div>
          : ''
        }
      </Host>
    )
  }
}
