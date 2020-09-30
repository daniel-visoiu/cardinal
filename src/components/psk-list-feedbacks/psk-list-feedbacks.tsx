import { Component, State, Event, EventEmitter, Listen, h, Prop, Watch } from "@stencil/core";
import { Message } from '../../interfaces/FeedbackMessage'
import { StyleCustomisation } from '../../interfaces/StyleCustomisation'
import Config from "./Config.js";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { TableOfContentEvent } from "../../decorators/TableOfContentEvent";
import CustomTheme from "../../decorators/CustomTheme";
@Component({
    tag: 'psk-list-feedbacks',
    shadow: true
})
export class PskListFeedbacks {
    private _styleCustomisation: StyleCustomisation = {};

    @State() alertOpened: boolean = false;
    @State() _messagesQueue: Message[] = [];
    @State() _messagesContent: Message[] = [];
    @State() timeMeasure: string;
    @State() timer = 0;
    @State() opened: boolean = false;
    @State() typeOfAlert: Array<string> = [];

    @CustomTheme()
    @TableOfContentProperty({
        description: `This property is a object based on StyleCustomisation interface `,
        isMandatory: false,
        propertyType: `StyleCustomisation type`,
        specialNote: `Even if you do not use all the parameters there will not be a problem with the default renderers.`,
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

    @TableOfContentProperty({
        description: `This property is the auto closing timer in milliseconds for the alert.`,
        isMandatory: false,
        propertyType: 'number',
        defaultValue: 5000,
        specialNote: `This property will only be taken into consideration when used with the psk-ui-alert child component`,
    })
    @Prop() timeAlive?: number;

    @TableOfContentProperty({
        description: `This property represents the number of toasts to be renderer on the user interface.`,
        isMandatory: false,
        propertyType: 'number',
        defaultValue: 3,
        specialNote: `This property will only be taken into consideration when used with the psk-ui-toast child component.`,
    })
    @Prop() messagesToDisplay?: number = 3;

    @TableOfContentProperty({
        description: `This property allows the component to display a custom toast in case the default one is not preferred.`,
        isMandatory: false,
        propertyType: 'string',
        defaultValue: 'psk-ui-toast',
        specialNote: `If this property is missing , psk-ui-toast will be assumed.`,
    })
    @Prop() toastRenderer?: string;

    @TableOfContentProperty({
        description: `This property allows the component to display a custom alert in case the default one is not preferred.`,
        isMandatory: false,
        propertyType: 'string',
        defaultValue: 'psk-ui-alert',
        specialNote: `If this property is missing , psk-ui-alert will be assumed.`,
    })
    @Prop() alertRenderer?: string;

    @TableOfContentEvent({
        eventName: 'openFeedback',
        controllerInteraction: {
            required: true
        },
        description: `This even is triggered when the user does an action that require feedback.This event comes with three parameters :
            message(string) : the message for the action that was executed,
            name(string) : the name is necessary in case of a toast feedback and
            typeOfAlert(string) : either toast or a bootstrap alert.`
    })
    @Event({
        eventName: 'openFeedback',
        composed: true,
        cancelable: true,
        bubbles: true
    }) openFeedbackHandler: EventEmitter

    @Listen('closeFeedback')
    closeFeedbackHandler(closeData) {
        if (this.alertOpened) {
            this.alertOpened = false;
        }
        const deleteIndex = this._messagesContent.indexOf(closeData.detail)
        if (deleteIndex > -1) {
            this.typeOfAlert.splice(deleteIndex, 1)
            this._messagesContent.splice(deleteIndex, 1)
            this._messagesContent = this._messagesContent.slice()
            if (this._messagesQueue.length > 0) {
                this._messagesContent = [...this._messagesContent, this._messagesQueue.shift()]
            }
        }
    }

    componentWillLoad() {
        this.styleCustomisationWatcher(this.styleCustomisation);
        this.openFeedbackHandler.emit((message, name, typeOfAlert) => {
            if (typeOfAlert) {
                if(typeOfAlert instanceof Array){
                    typeOfAlert.forEach((alert) => {
                        this.typeOfAlert.push(alert)
                    })
                } else {
                    this.typeOfAlert.push(typeOfAlert)
                }
            } else {
                this.typeOfAlert.push('toast')
            }
            this.alertOpened = true;
            if (message instanceof Array) {
                message.forEach((mes) => {
                    this.addToMessageArray.bind(this)(mes, name)
                });
            } else {
                this.addToMessageArray.bind(this)(message, name)
            }
        })
    }

    timerToShow(message) {
        if (this._messagesContent.length > 0) {
            const time = new Date().getTime();
            const time2 = message.timer;
            let equation = Math.floor((time - time2) / Config.MINUTE)
            const minute = setTimeout(() => {
                this.timerToShow.bind(this)(message)
            }, Config.MINUTE_TICK)
            const hour = setTimeout(() => {
                this.timerToShow.bind(this)(message)
            }, Config.HOUR_TICK)
            switch (true) {
                case (equation <= 0):
                    this.timeMeasure = Config.RIGHT_NOW
                    minute
                    break;

                case (equation < 1):
                    this.timer = Math.floor((time - time2) / Config.MINUTE)
                    this.timeMeasure = "minute ago"
                    minute
                    break;

                case (equation < 60):
                    this.timer = Math.floor((time - time2) / Config.MINUTE)
                    this.timeMeasure = Config.MINUTES
                    minute
                    break;

                case (equation >= 60):
                    this.timer = Math.floor((time - time2) / Config.HOUR)
                    this.timeMeasure = Config.HOURS
                    hour
                    break;
            }
        } else {
            return;
        }
    }

    addToMessageArray(content, name) {
        const date = new Date();
        const messageToAdd: Message = {
            content: content,
            timer: date.getTime(),
            name: name
        }
        if (this._messagesContent.length + 1 <= this.messagesToDisplay) {
            this._messagesContent = [...this._messagesContent, messageToAdd]
        } else {
            this._messagesQueue = [...this._messagesQueue, messageToAdd]
        }
    }
    render() {
        let alertMessages = [];
        let _feedbackTag
        this._messagesContent.forEach((message, key) => {
            if (this.typeOfAlert[key] === 'toast') {
                _feedbackTag = this.toastRenderer ? this.toastRenderer : 'psk-ui-toast'
                this.timerToShow.bind(this)(message)
                alertMessages.push(<_feedbackTag
                    message={message}
                    timeSinceCreation={this.timer}
                    timeMeasure={this.timeMeasure}
                    styleCustomisation={this._styleCustomisation} />)
            }
            else {
                _feedbackTag = this.alertRenderer ? this.alertRenderer : 'psk-ui-alert'
                alertMessages.push(
                    <_feedbackTag
                        message={this._messagesContent[this._messagesContent.length - 1]}
                        typeOfAlert={this.typeOfAlert[key]}
                        timeAlive={this.timeAlive}
                        styleCustomisation={this._styleCustomisation} />
                )
            }
        })
        return (
            <div>
                {alertMessages ? alertMessages : null}
            </div>
        )

    }
}
