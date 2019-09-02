import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'menu-item-renderer',
  styleUrl: '../../themes/default/components/app-item-renderer/app-item-renderer.css',
  shadow: true
})

export class MenuItemRenderer {
  @Prop() value: string;

  render() {
    return (<a>
      <slot/>
    </a>);
  }
}
