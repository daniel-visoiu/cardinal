import {Component, h, Prop, Watch} from '@stencil/core';

@Component({
  tag: 'psk-ui-loader',
  styleUrl: './psk-ui-loader.css',
  shadow: true
})
export class PskUiLoader {

  @Prop() shouldBeRendered:boolean

  @Watch("shouldBeRendered")
  render() {


    if (this.shouldBeRendered) {
      return (
        <div class="loader-container">
          <div class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
          </div>
        </div>
      );
    }
  }
}
