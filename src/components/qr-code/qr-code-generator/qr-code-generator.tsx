import {Component, h, Prop, Element, State, Watch} from '@stencil/core';
import CustomTheme from "../../../decorators/CustomTheme";
import {BindModel} from '../../../decorators/BindModel';
import {QRCode} from "../../../libs/qrcode.js";

@Component({
  tag: 'qr-code-generator',
})
export class QrCodeGenerator {

  @BindModel() modelHandler;
  @CustomTheme()
  @Element() element;
  @Prop() data:any;
  @State() isLoaded = false;
  @Prop() title = "";


  @Watch("data")
    drawQRCodeCanvas(){
    if(this.isLoaded){
      let canvas = this.element.querySelector("canvas");
      canvas.innerHTML="";
      QRCode.toCanvas(canvas, this.data, function (error) {
        if (error){
          return console.log(error);
        }
      })
    }
  }

  componentDidLoad(){
    this.isLoaded = true;
    this.drawQRCodeCanvas();
  }

  render() {
    return (
      <psk-card title={this.title}>
      <div class="code_container">
        <div class="card-body text-center">
          <canvas class="code_canvas"/>
        </div>
      </div>
      </psk-card>
    );
  }
}

