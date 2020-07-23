import {Component, h, Prop, Element, State, Watch} from '@stencil/core';
import CustomTheme from "../../../decorators/CustomTheme";
import {BindModel} from '../../../decorators/BindModel';

@Component({
  tag: 'psk-barcode-generator',
})
export class PskBarcodeGenerator {

  @BindModel() modelHandler;
  @CustomTheme()
  @Element() element;
  @Prop() data:any;
  @State() isLoaded = false;
  @Prop() title: string = "";
  @Prop() type:string="";
  @Prop() size?:any = 32;




  @Watch("data")
  drawQRCodeCanvas(){
    if(this.isLoaded && this.data.length>0){
      let canvas = this.element.querySelector("canvas");
      canvas.innerHTML="";

      let tryToGenerateBarcode = () => {
        //@ts-ignore
        if (window.bwipjs) {
          try{
            //@ts-ignore
            window.bwipjs.toCanvas(canvas, {
              bcid: this.type,       // Barcode type
              text: this.data,    // Text to encode
              alttext:this.data,
              scale: 3,               // 3x scaling factor
              width: this.size,
              height: this.size,              // Bar height, in millimeters
              includetext: true,            // Show human-readable text
              textxalign: 'center',        // Always good to set this
            }, function (err) {
              if (err) {
                console.log(err);
              }
            });
          }catch (e) {
            //most commonly errors come from wrong input data format
          }

        } else {
          setTimeout(tryToGenerateBarcode, 100);
        }
      }
      tryToGenerateBarcode();
    }
  }

  componentDidLoad(){
    this.isLoaded = true;
    this.drawQRCodeCanvas();
  }

  render() {
    return (
      <psk-card title={this.title}>
        <script src="/cardinal/libs/bwip.js"></script>
        <div class="code_container">
          <div class="card-body text-center">
            <canvas class="code_canvas"/>
          </div>
        </div>
      </psk-card>
    );
  }
}

