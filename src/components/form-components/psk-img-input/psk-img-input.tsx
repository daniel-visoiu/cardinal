import {h, Component, Prop, Host, Element, Watch, State} from '@stencil/core';
import {BindModel} from '../../../decorators/BindModel';
import {TableOfContentProperty} from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';

@Component({
  tag: 'psk-img-input'
})
export class PskImgInput {

  @CustomTheme()

  @BindModel() modelHandler;

  @Element() private element: HTMLElement;

  render() {
    return <Host onclick={this.__clickHandler.bind(this)}  class={`form-group`}>
      {this.label && <psk-label label={this.label} />}

      {typeof this.imageSource !== "undefined" && this.imageSource !== null
        ? <img src={this.imageSource} alt={this.alt}></img>
        : <psk-label label={this.placeholder}></psk-label>
      }
      <psk-icon icon="pencil-alt" color="rgb(208, 31, 208)"></psk-icon>
      <input type="file" class="form-control-file form-control-sm" style={{"display": "none"}}
             onChange={this.__fileChangeHandler.bind(this)}/>
    </Host>
  }

  __fileChangeHandler = (event) => {
    let filesArray = Array.from(event.target.files);
    let changeEvent = new Event(this.eventName, {
      bubbles: true,
      composed: true,
      cancelable: true
    });

    let reader = new FileReader();
    reader.onload = (e) => {
      let imageDataUrl = e.target.result;
      fetch(imageDataUrl as string)
        .then(res => res.arrayBuffer())
        .then((imageContent) => {
          changeEvent["data"] = imageContent;
          this.element.dispatchEvent(changeEvent);
        });
      this.src = imageDataUrl;
    };
    reader.readAsDataURL(filesArray[0] as File);
  }

  __clickHandler = (event) => {
    let fileChooser = this.element.querySelector("input");
    fileChooser.dispatchEvent(new MouseEvent("click"));
    event.stopImmediatePropagation();
  };

  @State() imageSource: any | null = null;

  @Watch("src")
  srcUpdate(newValue: string) {
    this.imageSource = newValue;
  }

  @TableOfContentProperty({
    description: [`Represent the src of the image that need to be displayed`],
    isMandatory: true,
    propertyType: 'string'
  })
  @Prop() src?: any | null = null;

  @TableOfContentProperty({
    description: [`Represent the alternative text that will be displayed if the image was not able to be loaded`],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() alt?: string | null = null;

  @TableOfContentProperty({
    description: [`Represent the text that will be displayed as placeholder when src attribute is not set`],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() placeholder?: string = 'click here to select source';

  @TableOfContentProperty({
    description: [`Represent the text that will be used as label for the input`],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() label?: string | null = null;

  @TableOfContentProperty({
    description: [`Represent the event type that will be thrown when user changes the image src`],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() eventName?: string | null = 'change';
}
