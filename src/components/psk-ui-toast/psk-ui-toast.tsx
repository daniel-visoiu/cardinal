import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core'
import {StyleCustomisation} from '../../interfaces/StyleCustomisation'

@Component({
    tag: "psk-ui-toast",
    styleUrls: ['../../themes/default/assets/bootstrap/css/bootstrap.min.css', './psk-ui-toast.css'],
    shadow: true
})

export class ToastComponent {
    @Prop({ reflectToAttr: true, mutable: true }) message: any
    @Prop({ reflectToAttr: true, mutable: true }) timeSinceCreation: number
    @Prop({ reflectToAttr: true, mutable: true }) timeMeasure: string = 'Right now';
    @Prop({ reflectToAttr: true, mutable: true }) styleCustomisation: StyleCustomisation
    @State() alert: any = null;
    @Event({
        eventName: 'closeFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) closeFeedback: EventEmitter

    render() {
        return (
            this.alert = (
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