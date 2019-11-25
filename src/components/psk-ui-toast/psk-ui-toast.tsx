import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core'
import {StyleCustomisation} from '../../interfaces/StyleCustomisation'
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
    tag: "psk-ui-toast",
    shadow: true
})

export class PskUiToast {
    @CustomTheme()
    @TableOfContentProperty({
        description: `This property is the message that will be rendered on the toast`,
        isMandatory : false,
        propertyType : 'any'
    })
    @Prop() message: any;

    @TableOfContentProperty({
        description:`The time in milliseconds when the toast was created`,
        isMandatory: true,
        propertyType: `number`
    })
    @Prop() timeSinceCreation: number;

    @TableOfContentProperty({
        description:`The time measure that will be renderer together with timeSinceCreation in order to get the live timer working properly`,
        isMandatory: true,
        propertyType: 'string',
        defaultValue: 'Right now'
    })
    @Prop() timeMeasure: string = 'Right now';

    @TableOfContentProperty({
        description: `The style customisation for the toast so it looks according to your application`,
        isMandatory: false,
        propertyType: `StyleCustomisation`,
    })
    @Prop() styleCustomisation: StyleCustomisation

    @State() toast: any = null;

    @TableOfContentEvent({
        eventName: `closeFeedback`,
        description: `When the X button is pressed this event is emitted in order to get rid of that specific feedback`
    })
    @Event({
        eventName: 'closeFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) closeFeedback: EventEmitter

    render() {
        return (
            this.toast = (
                <div class="toast fade out show" style={this.styleCustomisation.toast ? (this.styleCustomisation.toast.feedback ? (this.styleCustomisation.toast.feedback.style ? this.styleCustomisation.toast.feedback.style : {}) : {}) : {}}>
                    <div class="toast-header" style={this.styleCustomisation.toast ?( this.styleCustomisation.toast.header ? (this.styleCustomisation.toast.header.style ? this.styleCustomisation.toast.header.style : {} ) : {}):{}}>
                        <strong class="mr-auto">{this.message.name}</strong>
                        {(this.timeMeasure !== 'Right now') ? <small>{this.timeSinceCreation} {this.timeMeasure} </small> : <small>{this.timeMeasure} </small>}
                        <button
                            class="ml-2 mb-1 close"
                            title="Close"
                            onClick={() => {
                                this.closeFeedback.emit(this.message)

                            }}
                        >
                            <span >&times;</span>
                        </button>
                    </div>
                    <div class="toast-body" style={this.styleCustomisation.toast ?( this.styleCustomisation.toast.body ? (this.styleCustomisation.toast.body.style ? this.styleCustomisation.toast.body.style : {} ) : {}):{}}>
                        {this.message.content}
                    </div>
                </div>
            )
        )
    }
}
