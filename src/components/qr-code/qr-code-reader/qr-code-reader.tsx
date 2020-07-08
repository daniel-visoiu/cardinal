import { Component, h,  Prop, Element} from '@stencil/core';
import CustomTheme from "../../../decorators/CustomTheme";
import {BindModel} from '../../../decorators/BindModel';
import {Html5QrcodeScanner} from "../../../libs/html5-qrcode.js"
@Component({
  tag: 'qr-code-reader',
})
export class QrCodeReader {

  @BindModel() modelHandler;
  @CustomTheme()

  @Element() element;
  @Prop() data:any;
  @Prop() title:"";


  componentDidLoad(){

     let onScanSuccess = (qrCodeMessage) => {
       this.modelHandler.updateModel('data', qrCodeMessage);
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(this.element,
      "reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);

  }

  render() {
    return (
      <psk-card title={this.title}>
        <div class="code_container">
          <div class="card-body text-center">
            <div id="reader"></div>
          </div>
        </div>
      </psk-card>
    );
  }
}

