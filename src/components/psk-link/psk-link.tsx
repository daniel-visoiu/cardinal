import {Component, h, Prop, Event, EventEmitter, State} from "@stencil/core";
import {TableOfContentProperty} from "../../decorators/TableOfContentProperty";
import {TableOfContentEvent} from "../../decorators/TableOfContentEvent";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: "psk-link",
  shadow: true
})

export class PskLink {
  @CustomTheme()

  @TableOfContentProperty({
    description: "This property gives the component the destination URL after clicking the displayed link. This property is first validated by valdateUrl event.",
    isMandatory: true,
    propertyType: "string"
  })
  @Prop() page: string;

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

  @State() error: boolean = false;
  @State() destinationUrl: string = "#";

  componentDidLoad() {
    if (!this.page) {
      return;
    }

    this.validateUrl.emit({
      sourceUrl: this.page,
      callback: (err, data) => {
        if (!err) {
          this.destinationUrl = `${window.location.origin}${data}`;
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
        <a class={`btn btn-link ${this.error ? 'invalid-url' : ''}`}
           onClick={(evt: MouseEvent) => {
             if (this.error) {
               evt.preventDefault();
             } else {
               window.location.href = this.destinationUrl;
             }
           }}>
          <slot/>
        </a>
        {errorContent}
      </div>
    )
  }


}
