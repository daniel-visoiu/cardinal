import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core'
import Config from "../psk-list-feedbacks/Config.js";

import {StyleCustomisation} from '../../interfaces/StyleCustomisation';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty.js';
import CustomTheme from '../../decorators/CustomTheme.js';
@Component({
    tag: "psk-ui-alert",
    shadow: true
})

export class AlertComponent {
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
    @Prop() styleCustomisation: StyleCustomisation

    @State() alert: any = null;
    @State() isVisible: boolean = true;
    @Event({
        eventName: 'closeFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) closeFeedback: EventEmitter
    closeUIFeedback() {
        this.isVisible = false;
        setTimeout(() => {
            this.closeFeedback.emit(this.message)
        }, 1000);
    }
    render() {
        this.alert = (
            <div class={`alert ${this.typeOfAlert} alert-dismissible fade ${this.isVisible ? 'show' : 'hide'}`}  style={this.styleCustomisation.alert ? (this.styleCustomisation.alert.style ? this.styleCustomisation.alert.style : {} ) : {}} onClick={() => {
                this.closeUIFeedback()
            }}>
                <slot />
                <div class="toast-body">
                    {this.message.content}
                </div>
            </div>
        )
        setTimeout(() => {
            this.closeUIFeedback()
        }, this.timeAlive)
        return (
            this.alert
        )
    }
}
