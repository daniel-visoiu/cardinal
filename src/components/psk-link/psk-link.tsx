import { Component, h, Prop, Event, EventEmitter, State } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";
import CustomTheme from "../../decorators/CustomTheme";

let keywordsDictionary;

@Component({
  tag: "psk-link",
  shadow: true
})

export class PskLink {
  @CustomTheme()

  @TableOfContentProperty({
    description: "This property is helping the component to resolve the real URL of the target. This property is validated for the first time by the valdateUrl event.",
    isMandatory: false,
    propertyType: "string"
  })
  @Prop() page: string;

  @TableOfContentProperty({
    description: "This property gives the component a unique keyword which resolves a single page.",
    isMandatory: false,
    propertyType: "string"
  })
  @Prop() keyword: string;

  @TableOfContentEvent({
    controllerInteraction: {
      required: true
    },
    description: [
      `This event is sent to the application controller in order to check and validate the page property.`,
      `If the sequence of pages inside the page property is valid, then the event is sending back to the component the valid path to the required page.`,
      `If not, a special behavior will be applied to the link. On mouse over, it will turn grey and will display a hint message: "Temporary unavailable".`
    ]
  })
  @Event({
    eventName: "validateUrl",
    composed: true,
    bubbles: true,
    cancelable: true
  }) validateUrl: EventEmitter;

  @Event({
    eventName: "getKeywords",
    composed: true,
    bubbles: true,
    cancelable: true
  }) getKeywords: EventEmitter;

  @State() error: boolean = false;
  @State() destinationUrl: string = "#";

  getAssignedUrlFromKeyword(keyword, callback){
    if (!keywordsDictionary) {
      this.getKeywords.emit((err, data) => {
        if (err) {
          return callback(err);
        }
        keywordsDictionary = data;
        callback(undefined, keywordsDictionary[keyword])
      })
    }
    else callback(undefined, keywordsDictionary[keyword]);
  }

  componentWillLoad():Promise<any> {
    if (this.keyword) {
      return new Promise((resolve)=>{
        this.getAssignedUrlFromKeyword(this.keyword,  (error, url) => {
          if(error || !url){
            this.error = true;
          }
          else{
            this.destinationUrl = url;
          }
          resolve();
        })
      });
    }

    this.validateUrl.emit({
      sourceUrl: this.page,
      callback: (err, data) => {
        if (!err) {
          this.destinationUrl = data;
          this.error = false;
        } else {
          this.error = true;
        }
      }
    });

  }

  render() {
    let errorContent = null;
    if (this.error) {
      errorContent = <div class="tooltip-error">
        <div>Page <b>{this.page}</b> does not exists.</div>
      </div>
    }
    return (
      <div class="psk-link">
        {this.error ?
          <div><a class={`btn btn-link ${this.error ? 'invalid-url' : ''}`}
            onClick={(evt: MouseEvent) => {
              evt.preventDefault();
            }}>
            <slot />
          </a>
            {errorContent}</div> :
          <stencil-route-link url={this.destinationUrl} anchorClass="btn btn-link">
            <slot />
          </stencil-route-link>}
      </div>
    )
  }

}
