import {Component, h, Prop, Element} from '@stencil/core';
import CustomTheme from "../../../decorators/CustomTheme";
import {BindModel} from '../../../decorators/BindModel';
import audioData from './audioData.js';
const SCAN_TIMEOUT = 100;
const ANGLE_WIDTH=50;
const MOBILE_DIMENSIONS = {
  WIDTH:240,
  HEIGHT:320,
  FRAME_WIDTH:160
}
const PC_DIMENSIONS = {
  WIDTH:640,
  HEIGHT:480,
  FRAME_WIDTH:300
}

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
  private isMobileDevice=false;
  private cropOptions = null;

  disconnectedCallback(){
    this.componentIsDisconnected = true;
    this.stopTracks();
  }


   isMobile() {
    let userAgentKey ='userAgent';
    let sUserAgent = navigator[userAgentKey].toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM;
  }

  stopTracks(){
    if (window['stream']) {
      window['stream'].getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }


  addCanvasToView(canvasId){
    let scannerContainer = this.element.querySelector("#scanner_container");
    let canvasElement = document.createElement("canvas");
    canvasElement.id=canvasId;
    canvasElement.width=this.isMobileDevice?MOBILE_DIMENSIONS.WIDTH:PC_DIMENSIONS.WIDTH;
    canvasElement.height=this.isMobileDevice?MOBILE_DIMENSIONS.HEIGHT:PC_DIMENSIONS.HEIGHT;
    canvasElement.style.position = "absolute";
    canvasElement.style.width = "100%";
    canvasElement.style.height = "100%";
    canvasElement.style.top = "0";
    canvasElement.style.left = "0";
    scannerContainer.appendChild(canvasElement);
  }
  componentDidLoad(){
    if(this.componentIsDisconnected){
      return;
    }

    this.isMobileDevice = this.isMobile();
    let deviceDimmensions = this.isMobileDevice?MOBILE_DIMENSIONS:PC_DIMENSIONS;

    let xPadding = (deviceDimmensions.WIDTH - deviceDimmensions.FRAME_WIDTH)/2;
    let yPadding = (deviceDimmensions.HEIGHT - deviceDimmensions.FRAME_WIDTH)/2;

    //this.cropOptions = [80,160,320,320];
    //for mobile devices we double the proportions because we don't want to touch the image quality by performing any image resizing
    this.cropOptions = this.isMobileDevice?[xPadding*2,yPadding*2,deviceDimmensions.FRAME_WIDTH*2,deviceDimmensions.FRAME_WIDTH*2]:[xPadding,yPadding,deviceDimmensions.FRAME_WIDTH,deviceDimmensions.FRAME_WIDTH];

    this.addCanvasToView("lensCanvas");
    this.addCanvasToView("overlayCanvas");

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

  drawLensCanvas(){
   let canvas = this.element.querySelector("#lensCanvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();

    //polygon1--- usually the outside polygon, must be clockwise
    let polygonPoints = this.isMobileDevice ? [
        [0, 0],
        [MOBILE_DIMENSIONS.WIDTH, 0],
        [MOBILE_DIMENSIONS.WIDTH, MOBILE_DIMENSIONS.HEIGHT],
        [0, MOBILE_DIMENSIONS.HEIGHT]
      ]
      :
      [
        [0, 0],
        [PC_DIMENSIONS.WIDTH, 0],
        [PC_DIMENSIONS.WIDTH, PC_DIMENSIONS.HEIGHT],
        [0, PC_DIMENSIONS.HEIGHT]
      ];

    ctx.moveTo(polygonPoints[0][0],polygonPoints[0][1]);
    ctx.lineTo(polygonPoints[1][0],polygonPoints[1][1]);
    ctx.lineTo(polygonPoints[2][0],polygonPoints[2][1]);
    ctx.lineTo(polygonPoints[3][0],polygonPoints[3][1]);
    ctx.lineTo(polygonPoints[0][0],polygonPoints[0][1]);
    ctx.closePath();

    //polygon2 --- usually hole,must be counter-clockwise

    let deviceDimmensions = this.isMobileDevice?MOBILE_DIMENSIONS:PC_DIMENSIONS;

    let xPadding = (deviceDimmensions.WIDTH - deviceDimmensions.FRAME_WIDTH)/2;
    let yPadding = (deviceDimmensions.HEIGHT - deviceDimmensions.FRAME_WIDTH)/2;
    let frameWidth = deviceDimmensions.FRAME_WIDTH;
    let holePoints = [[xPadding,yPadding],[xPadding, yPadding+frameWidth],[xPadding+frameWidth, yPadding+frameWidth],[xPadding+frameWidth, yPadding]];
    //let holePoints = this.isMobileDevice?[[40,80],[40,240],[200,240],[200,80]]:[[170,90],[170,390],[470,390],[470,90]];
    ctx.moveTo(holePoints[0][0],holePoints[0][1]);
    ctx.lineTo(holePoints[1][0],holePoints[1][1]);
    ctx.lineTo(holePoints[2][0],holePoints[2][1]);
    ctx.lineTo(holePoints[3][0],holePoints[3][1]);
    ctx.lineTo(holePoints[0][0],holePoints[0][1]);
    ctx.closePath();

    ctx.fillStyle = "#77777799";
    ctx.strokeStyle = "#FFFFFFFF"
    ctx.lineWidth = 2;
    ctx.fill();

    let angleWidth = this.isMobileDevice?ANGLE_WIDTH/2:ANGLE_WIDTH;
    this.addLensCorners(ctx,xPadding, yPadding, frameWidth, angleWidth);
  }

  gotStream(stream) {
    window['stream'] = stream; // make stream available to console
    this.videoElement.srcObject = stream;
    this.drawLensCanvas();
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
    //@ts-ignore
    let decodeCallback =  (ptr, len, resultIndex, resultCount, x1, y1, x2, y2, x3, y3, x4, y4) => {
      let result = new Uint8Array(this.ZXing.HEAPU8.buffer, ptr, len);

      let stringResult = "";
      let separatorIndex = 0;
      let separatorStarted = false;
      for (let i = 0; i < result.length; i++) {
        //29 -  group separator char code
        if (result[i] == 29) {
          stringResult += "(";
          separatorStarted = true;
          separatorIndex = 0;
        } else {
          stringResult += String.fromCharCode(result[i]);
          if (separatorStarted) {
            separatorIndex++;
            if (separatorIndex == 2) {
              stringResult += ")";
              separatorStarted = false;
            }
          }
        }
      }

      this.modelHandler.updateModel('data', stringResult);
      audioData.play();
      this.drawOverlay(x1, y1, x2, y2, x3, y3, x4, y4);
      if (!this.componentIsDisconnected) {
        setTimeout(this.scanBarcode.bind(this), 1000);
      }
    };

  }

  drawOverlay(x1,y1,x2,y2,x3,y3,x4,y4){
    //let paddings = this.isMobileDevice? [80,160]:[170,90];
    let paddings = [this.cropOptions[0],this.cropOptions[1]];
    let isLine = x3 + y3 + x4 + y4 === 0;

    x1+=paddings[0];
    x2+=paddings[0];
    x3+=paddings[0];
    x4+=paddings[0];

    y1+=paddings[1];
    y2+=paddings[1];
    y3+=paddings[1];
    y4+=paddings[1];

    let canvas = this.element.querySelector('#overlayCanvas');
    canvas.width = this.videoElement['videoWidth'];
    canvas.height = this.videoElement['videoHeight'];
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#48d96099"
      ctx.fillStyle = "#48d96099";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();

      if (isLine) {
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
      ctx.strokeStyle = "#48d960FF"
      let xPadding = this.cropOptions[0];
      let yPadding = this.cropOptions[1];
      let frameWidth = this.cropOptions[2];
      this.addLensCorners(ctx,xPadding, yPadding, frameWidth, ANGLE_WIDTH);
      setTimeout(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },500);

    }
  }

  private addLensCorners(ctx,xPadding,yPadding, frameWidth, angleWidth) {
    ctx.beginPath();
    //top-left corner
    ctx.moveTo(xPadding, yPadding + angleWidth);
    ctx.lineTo(xPadding, yPadding);
    ctx.lineTo(xPadding + angleWidth, yPadding);

    //top-right corner
    ctx.moveTo(xPadding + frameWidth - angleWidth, yPadding);
    ctx.lineTo(xPadding + frameWidth, yPadding);
    ctx.lineTo(xPadding + frameWidth, yPadding + angleWidth);
    //bottom-right corner
    ctx.moveTo(xPadding + frameWidth - angleWidth, yPadding + frameWidth);
    ctx.lineTo(xPadding + frameWidth, yPadding + frameWidth);
    ctx.lineTo(xPadding + frameWidth, yPadding + frameWidth - angleWidth);
    //bottom-left corner
    ctx.moveTo(xPadding, yPadding + frameWidth - angleWidth);
    ctx.lineTo(xPadding, yPadding + frameWidth);
    ctx.lineTo(xPadding + angleWidth, yPadding + frameWidth);

    ctx.stroke();
  }

  scanBarcode() {
    // let vid = this.element.querySelector("#video");
    let barcodeCanvas = document.createElement("canvas");
    //[x,y, width, height]
    let crpOpt = this.cropOptions;
    barcodeCanvas.width = crpOpt[2];
    barcodeCanvas.height = crpOpt[3];
    let barcodeContext = barcodeCanvas.getContext('2d');
    //let imageWidth = vid['videoWidth'], imageHeight = vid['videoHeight'];

    //barcodeContext.drawImage(this.videoElement, 0, 0, imageWidth, imageHeight);
    barcodeContext.drawImage(this.videoElement, crpOpt[0],crpOpt[1],crpOpt[2],crpOpt[3],0,0,crpOpt[2],crpOpt[3]);
    // read barcode
    //let imageData = barcodeContext.getImageData(0, 0, imageWidth, imageHeight);
    let imageData = barcodeContext.getImageData(0,0,crpOpt[2],crpOpt[3]);
    let idd = imageData.data;
    let image = this.ZXing._resize(crpOpt[2], crpOpt[3]);

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
    if(this.componentIsDisconnected){
      return  null;
    }
    return (
      [<script async src="/cardinal/libs/zxing.js"></script>,
      <psk-card title={this.title}>
        <div class="select">
          <label>Video source: </label><select id="videoSource"></select>
        </div>

        <div style={{position:"relative"}} id="scanner_container">
          <video muted autoplay id="video" playsinline="true" style={{width:"100%"}}></video>
        </div>

      </psk-card>]
    );
  }
}

