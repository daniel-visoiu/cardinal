import {Component, h, Prop, Event, EventEmitter, State} from "@stencil/core";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";
import {TableOfContentEvent} from "../../decorators/TableOfContentEvent";
import CustomTheme from "../../decorators/CustomTheme";

let tagsDictionary;

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
    description: "This property gives the component a unique tag which resolves a single page.",
    isMandatory: false,
    propertyType: "string"
  })
  @Prop() tag: string;

  @TableOfContentProperty({
    description: "This property allows user to create a complex URL containing a page chapter identifier",
    isMandatory: false,
    propertyType: "string"
  })
  @Prop() chapter: string;

  @TableOfContentEvent({
    controllerInteraction: {
      required: true
    },
    description: [
      `This event is sent to the application controller in order to check and validate the page property.`,
      `If the sequence of pages inside the page property is valid, then the event is sending back to the component the valid path to the required page.`,
      `If not, a special behavior will be applied to the link. On mouse over, it will turn grey and will display a hint message: "Page {page-name} does not exists".`
    ]
  })
  @Event({
    eventName: "validateUrl",
    composed: true,
    bubbles: true,
    cancelable: true
  }) validateUrl: EventEmitter;

  @TableOfContentEvent({
    controllerInteraction: {
      required: true
    },
    description: [
      `This event is sent to the application controller in order get the dictionary that keeps the mapped tags to their real page URLs`,
    ]
  })
  @Event({
    eventName: "getTags",
    composed: true,
    bubbles: true,
    cancelable: true
  }) getTags: EventEmitter;

  @State() error: boolean = false;
  @State() destinationUrl: string = "#";

  getAssignedUrlFromTag(tag, callback) {
    if (!tagsDictionary) {
      this.getTags.emit((err, data) => {
        if (err) {
          return callback(err);
        }
        tagsDictionary = data;
        callback(undefined, tagsDictionary[tag])
      })
    }
    else callback(undefined, tagsDictionary[tag]);
  }

  componentWillLoad() {

    let setLinkUrl = (error, url) => {
      if (error || !url) {
        this.error = true;
      }
      else {
        this.destinationUrl = this.chapter ? url + "&chapter=" + this.chapter : url;
      }
    };

    if (this.tag) {
      return this.getAssignedUrlFromTag(this.tag, setLinkUrl)
    }

    if(this.page){
      this.validateUrl.emit({
        sourceUrl: this.page,
        callback: setLinkUrl
      });
    }

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
            <slot/>
          </a>
            {errorContent}</div> :
          <stencil-route-link url={this.destinationUrl} anchorClass="btn btn-link">
            <slot/>
          </stencil-route-link>}
      </div>
    )
  }

}
