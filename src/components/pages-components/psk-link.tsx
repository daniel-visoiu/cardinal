import { Component, h, Prop, Event, EventEmitter, State } from "@stencil/core";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";

@Component({
    tag: "psk-link",
    styleUrl: "./page.css"
})

export class PskLink {

    @TableOfContentProperty({
        description: "This property gives the component the destination URL after clicking the displayed link. This property is first validated by valdateUrl event.",
        isMandatory: true,
        propertyType: "string"
    })
    @Prop() page: string;

    @TableOfContentEvent({
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

    render() {
        return (
            <button type="button"
                title={this.error ? "Temporary unavailable" : ""}
                class={`btn btn-link ${this.error ? 'invalid-url' : ''}`}
                onClick={(evt: MouseEvent) => {
                    if (this.error) {
                        evt.preventDefault();
                    } else {
                        window.location.href = this.destinationUrl;
                    }
                }}>
                <slot />
            </button>
        )
    }

    componentDidLoad() {
        if (!this.page) {
            return;
        }

        this.validateUrl.emit({
            sourceUrl: this.page,
            callback: (err, data) => {
                if (!err) {
                    this.destinationUrl = `${window.location.origin}/#${data}`;
                } else {
                    this.error = true;
                }
            }
        });
    }
}
