import { Component,  h } from '@stencil/core';


@Component({
  tag: 'app-container',
  shadow: true
})
export class AppContainer {
  render() {
    return <app-menu></app-menu>;
  }
}
