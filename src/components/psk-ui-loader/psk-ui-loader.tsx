import {Component, h, Prop, Watch} from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
  tag: 'psk-ui-loader',
  shadow: true
})
export class PskUiLoader {
  @CustomTheme()
  @TableOfContentProperty({
    description: `This is the property that gives the state of the loader, if it is displayed or not. The possible values are true or false.`,
    isMandatory: false,
    propertyType: 'boolean',
    defaultValue: 'false'
  })
  @Prop() shouldBeRendered:boolean=false;

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
