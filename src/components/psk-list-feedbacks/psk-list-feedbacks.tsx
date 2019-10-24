import { Component, State, Event, EventEmitter, Listen, h, Prop } from "@stencil/core";
import { Message } from '../../interfaces/FeedbackMessage'
import { StyleCustomisation } from '../../interfaces/StyleCustomisation'
import Config from "./Config.js";
@Component({
    tag: 'psk-list-feedbacks',
    styleUrl: './psk-list-feedbacks.css',
    shadow: true
})
export class PskListFeebacks {
    @State() alertOpened: boolean = false;
    @State() _messagesQueue: Message[] = [];
    @State() _messagesContent: Message[] = [];
    @State() timeMeasure: string;
    @State() timer = 0;
    @State() opened: boolean = false;
    @State() typeOfAlert: Array<string> = [];
    @Prop() styleCustomisation: StyleCustomisation
    @Prop() timeAlive: number = 5;
    @Prop() messagesToDisplay: number = 3;
    @Prop() toastRenderer: string;
    @Prop() alertRenderer: string;


    @Event({
        eventName: 'openFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
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
        this.openFeedbackHandler.emit((message, name, typeOfAlert) => {
            if (typeOfAlert) {
                this.typeOfAlert.push(typeOfAlert)
            } else {
                this.typeOfAlert.push('toast')
            }
            this.alertOpened = true;
            if (message instanceof Array) {
                message.forEach((mes, name) => {
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
            const minute =setTimeout(() => {
                this.timerToShow.bind(this)(message)
            }, Config.MINUTE_TICK)
            const hour =setTimeout(() => {
                this.timerToShow.bind(this)(message)
            }, Config.HOUR_TICK)
            switch (true) {
                case (equation <= 0):
                    this.timeMeasure = Config.RIGHT_NOW
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
                    styleCustomisation={this.styleCustomisation} />)
            }
            else {
                _feedbackTag = this.alertRenderer ? this.alertRenderer : 'psk-ui-alert'
                alertMessages.push(
                    <_feedbackTag
                        message={this._messagesContent[this._messagesContent.length - 1]}
                        typeOfAlert={this.typeOfAlert[key]}
                        timeAlive={this.timeAlive}
                        styleCustomisation={this.styleCustomisation} />
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