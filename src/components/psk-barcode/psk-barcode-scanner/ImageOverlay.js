import BarcodeUtilFunctions from "./barcode-util-functions";
import CanvasOverlay from "./CanvasOverlay";


export default class ImageOverlay extends CanvasOverlay{

  constructor(scannerContainer) {
    super(scannerContainer);
  }

  createOverlaysCanvases(imageCanvas){
    let style = {
      position:"relative",
      display:"block"
    }
    this.imageCanvas = this.addCanvasToView(imageCanvas,style);
  }

  removeOverlays(){
    this.scannerContainer.removeChild(this.imageCanvas)
  }

  getImageCanvasContext(){
    return this.imageCanvas.getContext("2d");
  }


  drawOverlay(points){

    let x1,y1,x2,y2,x3,y3,x4,y4;
    x1 = points.x1;
    y1 = points.y1;
    x2 = points.x2;
    y2 = points.y2;
    x3 = points.x3;
    y3 = points.y3;
    x4 = points.x4;
    y4 = points.y4;


    let isLine = x3 + y3 + x4 + y4 === 0;
    if (this.imageCanvas.getContext) {
      let ctx = this.imageCanvas.getContext('2d');
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#48d96099"
      ctx.fillStyle = "#48d96099";

      ctx.beginPath();

      if (isLine) {
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      else{
        let points = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]];
        BarcodeUtilFunctions.polySort(points);
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.lineTo(points[3][0], points[3][1]);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  drawUnmatch(message){
    let ctx = this.imageCanvas.getContext('2d');
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.beginPath();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fill();
    let fontSize = Math.floor(ctx.canvas.width/20);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = fontSize+'px serif';
    let textWidth = ctx.measureText(message).width;

    ctx.fillText(message , (ctx.canvas.width/2) - (textWidth / 2), (ctx.canvas.height/2) + fontSize);


  }
}
