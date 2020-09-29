import BarcodeUtilFunctions from "./barcode-util-functions";

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

export default class CanvasOverlay{

  constructor(scannerContainer, restrictResponsiveness) {
    this.PC_DIMENSIONS = PC_DIMENSIONS;
    this.MOBILE_DIMENSIONS = MOBILE_DIMENSIONS;
    this.scannerContainer = scannerContainer;
    this.isMobileDevice = BarcodeUtilFunctions.isMobile(restrictResponsiveness);
  }

  addCanvasToView(canvasId, customStyle){
    let canvasElement = document.createElement("canvas");
    canvasElement.id=canvasId;
    canvasElement.width=this.isMobileDevice?MOBILE_DIMENSIONS.WIDTH:PC_DIMENSIONS.WIDTH;
    canvasElement.height=this.isMobileDevice?MOBILE_DIMENSIONS.HEIGHT:PC_DIMENSIONS.HEIGHT;
    canvasElement.style.position = "absolute";
    canvasElement.style.width = "100%";
    canvasElement.style.top = "0";
    canvasElement.style.left = "0";

    if (typeof customStyle === "object") {
      Object.keys(customStyle).forEach(key => {
        if (canvasElement.style[key])
          canvasElement.style[key] = customStyle[key];
      })
    }

    this.scannerContainer.appendChild(canvasElement);
    return canvasElement;
  }

}
