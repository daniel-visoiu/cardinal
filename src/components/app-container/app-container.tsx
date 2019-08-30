import { Component,  h } from '@stencil/core';


@Component({
  tag: 'app-container',
  styleUrl: 'app-container.css',
  shadow: true
})
export class AppContainer {
  render() {
    return <app-menu></app-menu>;
  }
}
