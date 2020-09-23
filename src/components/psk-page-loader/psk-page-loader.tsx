import { Component, h, Prop, State, Watch,Element } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { BindModel } from "../../decorators/BindModel";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'psk-page-loader',
  shadow: true
})
export class PskPageLoader {

  @BindModel() modelHandler;
  @CustomTheme()

  @State() pageContent: string;
  @State() errorLoadingPage: boolean = false;
  @Element() element;

  @TableOfContentProperty({
    description: [`This property is the url for the page that needs to be loaded.`,
      `When this component loads a get http request will be issued and the cotent of that url will be rendered if it can be accessed.`],
    isMandatory: true,
    propertyType: 'string'
  })
  @Prop() pageUrl: string;


  @TableOfContentProperty({
    description: [`This property indicates if the page should use an iframe or div to render the content retrieved using pageSrc property.`,
     `Accepted values: iframe, div`,
     `Default value:div`],
    isMandatory: false,
    propertyType: 'string'
  })
  @Prop() type: string = "div";

  componentWillLoad(): Promise<void> | void {
    if(this.element.isConnected){
      return new Promise((resolve) => {
        this.getPageContent(this.pageUrl, this.getPageHandler(resolve));
      });
    }
  }

  @Watch('pageUrl')
  watchHandler(newValue: boolean) {
    this.getPageContent(newValue, this.getPageHandler());
  }

  getPageHandler(callback?: Function) {
    let self = this;
    return function (err, data) {
      if (err) {
        self.errorLoadingPage = true;
      } else {
        self.errorLoadingPage = false;
        self.pageContent = data;
      }
      if (typeof callback === "function") {
        callback();
      }
    }
  }

  getPageContent(pageUrl, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', pageUrl);

    xhr.onload = () => {
      if (xhr.status != 200) {
        callback(new Error("Some error occurred"));
      } else {
        callback(undefined, xhr.responseText);
      }
    };

    xhr.onerror = () => {
      this.errorLoadingPage = true;
    };
    xhr.send();
  }

  render() {

    let renderedComponent = null;
    if( this.type && this.type.toLowerCase()==="iframe"){
      renderedComponent = <iframe class="iframe_page_content"
                                  frameborder="0" style={{
                                  overflow: "hidden",
                                  height: "100%",
                                  width: "100%"
      }}
                                  src={`data:text/html;charset=utf-8, ${escape(this.pageContent)}`}/>;
    }
    else{
      renderedComponent = <div
        class="page_content" style={{height: "100%", width: "100%"}}
        innerHTML={this.pageContent}/>
    }

    return (
      this.errorLoadingPage ?
        <h4>{`Page ${this.pageUrl} could not be loaded!`}</h4> :
        renderedComponent

    )
  }
}
