import { Component, Prop, Host, h } from '@stencil/core';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
  tag: 'psk-tab',
  shadow: true
})

export class PskTab {

  @CustomTheme()

  @Prop() title: string;

  render() {
    return (
      <Host hidden>
        <slot />
      </Host>
    )
  }
}
