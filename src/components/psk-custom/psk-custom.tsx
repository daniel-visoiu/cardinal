import { Component, h } from '@stencil/core';

import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'psk-custom',
  shadow: true
})

export class PskCustom {
  @CustomTheme()

  render() {
    return (
      <div>
        <slot />
      </div>
    )
  }
}
