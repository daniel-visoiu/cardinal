import {Component, h, Prop, Element} from '@stencil/core';
import CustomTheme from "../../../decorators/CustomTheme";
import {BindModel} from '../../../decorators/BindModel';
import audioData from './audioData.js';
const SCAN_TIMEOUT = 100;
@Component({
  tag: 'psk-barcode-scanner',
})
export class PskBarcodeScanner {

  @BindModel() modelHandler;
  @CustomTheme()
  @Element() element;
  @Prop() data:any;
  @Prop() title: string = "";

  private componentIsDisconnected = false;
  private ZXing = null;
  private decodePtr = null;
  private  videoElement = null;

  disconnectedCallback(){
    this.componentIsDisconnected = true;
    this.stopTracks();
  }


  stopTracks(){
    if (window['stream']) {
      window['stream'].getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }
  componentDidLoad(){
    this.videoElement = this.element.querySelector('video');

    let getStream = () => {
      this.stopTracks();

      let constraints = {
        audio: false
      };

      if (videoSelect.value) {
        constraints['video'] = {
          deviceId: {exact: videoSelect.value}
        }
      } else {
        constraints['video'] = true
      }

      navigator.mediaDevices.getUserMedia(constraints).then(this.gotStream.bind(this)).catch(handleError);
    }


    let videoSelect = this.element.querySelector('select#videoSource');
    navigator.mediaDevices.enumerateDevices()
      .then(gotDevices).then(getStream).catch(handleError);

    videoSelect.onchange = getStream;

    function gotDevices(deviceInfos) {
      for (let i = deviceInfos.length - 1; i >= 0; --i) {
        let deviceInfo = deviceInfos[i];
        let option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || 'camera ' +
            (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log('Found one other kind of source/device: ', deviceInfo);
        }
      }
    }

    function handleError(error) {
      console.log('Error: ', error);
    }
  }
  gotStream(stream) {
    window['stream'] = stream; // make stream available to console
    this.videoElement.srcObject = stream;

    let tick =  () => {
      if (window['ZXing']) {
        this.ZXing = window['ZXing']();
        this.decodePtr = this.ZXing.Runtime.addFunction(decodeCallback);
        setTimeout(this.scanBarcode.bind(this), SCAN_TIMEOUT);
      } else {
        setTimeout(tick,SCAN_TIMEOUT);
      }
    };

    setTimeout(tick,SCAN_TIMEOUT);
    let decodeCallback =  (ptr, len, resultIndex, resultCount, x1, y1, x2, y2, x3, y3, x4, y4) => {
      console.log(resultIndex, resultCount, ptr, len);
      let result = new Uint8Array(this.ZXing.HEAPU8.buffer, ptr, len);
      let stringResult = String.fromCharCode.apply(null, result);
      this.modelHandler.updateModel('data', stringResult);
      audioData.play();
      this.drawOverlay(x1, y1, x2, y2, x3, y3, x4, y4);
      if (!this.componentIsDisconnected) {
        setTimeout(this.scanBarcode.bind(this), 1000);
      }
    };

  }

  drawOverlay(x1,y1,x2,y2,x3,y3,x4,y4){
    let canvas = this.element.querySelector('#overlayCanvas');
    canvas.width = this.videoElement['videoWidth'];
    canvas.height = this.videoElement['videoHeight'];
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#48d96099"
      ctx.fillStyle = "#48d96099";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();

      if (x3 + y3 + x4 + y4 === 0) {
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      else{
        let points = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]];
        this.polySort(points);
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.lineTo(points[3][0], points[3][1]);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      setTimeout(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },500);

    }
  }

  scanBarcode() {
    let vid = this.element.querySelector("#video");
    let barcodeCanvas = document.createElement("canvas");
    barcodeCanvas.width = vid['videoWidth'];
    barcodeCanvas.height = vid['videoHeight'];
    let barcodeContext = barcodeCanvas.getContext('2d');
    let imageWidth = vid['videoWidth'], imageHeight = vid['videoHeight'];
    barcodeContext.drawImage(this.videoElement, 0, 0, imageWidth, imageHeight);
    // read barcode
    let imageData = barcodeContext.getImageData(0, 0, imageWidth, imageHeight);
    let idd = imageData.data;
    let image = this.ZXing._resize(imageWidth, imageHeight);
    //console.time("decode barcode");
    for (let i = 0, j = 0; i < idd.length; i += 4, j++) {
      this.ZXing.HEAPU8[image + j] = idd[i];
    }
    let err = this.ZXing._decode_any(this.decodePtr);
    if (err === -2) {
      if(!this.componentIsDisconnected ){
        setTimeout(this.scanBarcode.bind(this), SCAN_TIMEOUT);
      }
    }
  }


  /* https://stackoverflow.com/questions/59287928/algorithm-to-create-a-polygon-from-points */
  polySort(points) {
    // Get "centre of mass"
    let centre = [points.reduce((sum, p) => sum + p[0], 0) / points.length,
      points.reduce((sum, p) => sum + p[1], 0) / points.length];

    // Sort by polar angle and distance, centered at this centre of mass.
    for (let point of points) point.push(...this.squaredPolar(point, centre));
    points.sort((a, b) => a[2] - b[2] || a[3] - b[3]);
    // Throw away the temporary polar coordinates
    for (let point of points) point.length -= 2;
  }

  squaredPolar(point, centre) {
    return [
      Math.atan2(point[1] - centre[1], point[0] - centre[0]),
      (point[0] - centre[0]) ** 2 + (point[1] - centre[1]) ** 2 // Square of distance
    ];
  }


  render() {
    return (
      [<script async src="/cardinal/libs/zxing.js"></script>,
      <psk-card title={this.title}>
        <div class="select">
          <label>Video source: </label><select id="videoSource"></select>
        </div>

        <div style={{position:"relative"}}>
          <video muted autoplay id="video" playsinline="true" style={{width:"100%"}}></video>
          <canvas width="600" height="400" id="overlayCanvas" style={{
            "position":"absolute",
            "width":"100%",
            "height":"100%",
            top:"0",
            left:"0",
            background:"rgba(200,220,254,0.2)"
          }}/>
        </div>

      </psk-card>]
    );
  }
}

