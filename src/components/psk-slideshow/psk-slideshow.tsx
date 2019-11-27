import {Component, h, Listen, Prop, State, Element} from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'psk-slideshow',
  shadow: true
})
export class PskPageLoader {
  @CustomTheme()
  @Prop() images: string;
  @Prop() top: string;
  @State() imagesSrcs: Array<string>;
  @State() slideshowHeight;
  @State() marginTop;

  @Element() element;

  componentWillLoad() {
    this.marginTop = this.element.getBoundingClientRect().y;
    this.checkLayout();
    this.imagesSrcs = this.images.split(",");
  }

  @Listen("resize", {capture: true, target: 'window'})
  checkLayout() {
    this.slideshowHeight = document.documentElement.clientHeight - this.marginTop;
  }


  renderSlide(imageSrc, id) {
    let slide =
      <li id={"slide-"+id} class={"animation-"+id}
      style={{backgroundImage: "url("+imageSrc+")"}}>
    </li>;

    return slide;
  }

  render() {
    let slides = [];
    this.imagesSrcs.forEach((imageSrc, idx) => {
      slides.push(this.renderSlide(imageSrc, idx));
    });
    return <div class="psk-slideshow">
      <div class="psk-slideshow-container">
        <div id="psk-content-slider">
          <div id="psk-slider">
            <div id="psk-slider-mask" style={{height:this.slideshowHeight+"px"}}>
              <ul>
                {slides}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
