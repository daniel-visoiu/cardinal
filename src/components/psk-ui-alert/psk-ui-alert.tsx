import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core'
import Config from "../psk-list-feedbacks/Config.js";

import {StyleCustomisation} from '../../interfaces/StyleCustomisation';
@Component({
    tag: "psk-ui-alert",
    styleUrls: ['../../themes/default/assets/bootstrap/css/bootstrap.min.css', './psk-ui-alert.css'],
    shadow: true
})

export class AlertComponent {
    @Prop({ reflectToAttr: true, mutable: true }) typeOfAlert: string = Config.ALERT_SUCCESS
    @Prop({ reflectToAttr: true, mutable: true }) message: any
    @Prop({ reflectToAttr: true, mutable: true }) timeAlive: any;
    @Prop({ reflectToAttr: true, mutable: true }) styleCustomisation: StyleCustomisation
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
