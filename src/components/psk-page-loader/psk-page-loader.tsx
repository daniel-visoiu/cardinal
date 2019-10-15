import {Component, h, Prop, State} from "@stencil/core";

@Component({
  tag: 'psk-page-loader',
  shadow: true
})
export class PskPageLoader {

  @Prop() pageUrl: string;
  @State() pageContent: string;
  @State() errorLoadingPage: boolean = false;

  componentWillLoad() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', this.pageUrl);

    xhr.onload = () => {
      if (xhr.status != 200) {
        this.errorLoadingPage = true;
      } else {
        this.pageContent = xhr.responseText;
      }
    };

    xhr.onerror = () => {
      this.errorLoadingPage = true;
    };
    xhr.send();
  }

  render() {
    return (

      this.errorLoadingPage ?

        <h4>{`Page ${this.pageUrl} could not be loaded!`}</h4> :
        <div class="page_content" innerHTML={this.pageContent}/>

    )
  }
}
