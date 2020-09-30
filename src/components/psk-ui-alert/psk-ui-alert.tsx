import { Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core'
import Config from "../psk-list-feedbacks/Config.js";

import {StyleCustomisation} from '../../interfaces/StyleCustomisation';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
@Component({
    tag: "psk-ui-alert",
    styleUrl:"../../assets/css/bootstrap/bootstrap.css",
    shadow: true
})

export class PskUiAlert {
    private _styleCustomisation: StyleCustomisation = {};

    @CustomTheme()
    @TableOfContentProperty({
        description: `This property is a string that indicates the type of alert that you want so send back to the user`,
        isMandatory: false,
        propertyType: `string`,
        defaultValue:`alert-success`
    })
    @Prop() typeOfAlert: string = Config.ALERT_SUCCESS

    @TableOfContentProperty({
        description: `This property is the message that will be rendered on the alert`,
        isMandatory : false,
        propertyType : 'any'
    })
    @Prop() message: any

    @TableOfContentProperty({
        description: `This property is the time in milliseconds t`,
        isMandatory : false,
        propertyType : 'any'
    })
    @Prop() timeAlive: any = 3000;

    @TableOfContentProperty({
        description: `The style customisation for the alert so it looks according to your application`,
        isMandatory: false,
        propertyType: `StyleCustomisation`,
    })
    @Prop() styleCustomisation: StyleCustomisation | string = {}
    @Watch('styleCustomisation')
    styleCustomisationWatcher(newValue: StyleCustomisation | string) {
        if (typeof newValue === 'string') {
            this._styleCustomisation = JSON.parse(newValue);
        } else {
            this._styleCustomisation = newValue;
        }
    }

    @State() isVisible: boolean = true;
    @Event({
        eventName: 'closeFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) closeFeedback: EventEmitter

    alert: any = null;

    closeUIFeedback() {
        this.isVisible = false;
        setTimeout(() => {
            this.closeFeedback.emit(this.message)
        }, this.timeAlive);
    }

    componentWillLoad() {
        this.styleCustomisationWatcher(this.styleCustomisation);
    }

    render() {
        this.alert = (
            <div class={`alert-feedback ${this.typeOfAlert} alert-dismissible fade ${this.isVisible ? 'show' : 'hide'}`}  style={this._styleCustomisation.alert ? (this._styleCustomisation.alert.style ? this._styleCustomisation.alert.style : {} ) : {}} onClick={() => {
                this.closeUIFeedback()
            }}>
                <slot />
                <div >
                    {this.message.content}
                </div>
            </div>
        )
        this.closeUIFeedback();
        return (
            this.alert
        )
    }
}
