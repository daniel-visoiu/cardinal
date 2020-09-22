import { Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core'
import {StyleCustomisation} from '../../interfaces/StyleCustomisation'
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import { TableOfContentEvent } from '../../decorators/TableOfContentEvent';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
    tag: "psk-ui-toast",
    styleUrl:"../../assets/css/bootstrap/bootstrap.css",
    shadow: true
})

export class PskUiToast {
    private _styleCustomisation: StyleCustomisation = {};

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
    @Prop() styleCustomisation?: StyleCustomisation | string = {}
    @Watch('styleCustomisation')
    styleCustomisationWatcher(newValue: StyleCustomisation | string) {
        if (typeof newValue === 'string') {
            this._styleCustomisation = JSON.parse(newValue);
        } else {
            this._styleCustomisation = newValue;
        }
    }

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

    componentWillLoad() {
        this.styleCustomisationWatcher(this.styleCustomisation);
    }

    render() {
        return (
            this.toast = (
                <div class="toast fade out show" style={this._styleCustomisation.toast ? (this._styleCustomisation.toast.feedback ? (this._styleCustomisation.toast.feedback.style ? this._styleCustomisation.toast.feedback.style : {}) : {}) : {}}>
                    <div class="toast-header" style={this._styleCustomisation.toast ?( this._styleCustomisation.toast.header ? (this._styleCustomisation.toast.header.style ? this._styleCustomisation.toast.header.style : {} ) : {}):{}}>
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
                    <div class="toast-body" style={this._styleCustomisation.toast ?( this._styleCustomisation.toast.body ? (this._styleCustomisation.toast.body.style ? this._styleCustomisation.toast.body.style : {} ) : {}):{}}>
                        {this.message.content}
                    </div>
                </div>
            )
        )
    }
}
