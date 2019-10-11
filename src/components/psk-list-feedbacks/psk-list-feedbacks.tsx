import { Component, State, Event, EventEmitter, Listen, h, Prop } from "@stencil/core";
import { Message } from '../../interfaces/FeedbackMessage'

@Component({
    tag: 'psk-list-feedbacks',
    shadow: true
})
export class PskListFeebacks {
    @State() alertOpened: boolean = false;
    @State() _messagesQueue: Message[] = [];
    @State() _messagesContent: Message[] = [];
    @State() timeMeasure: string;
    @State() timer = 0;
    @State() opened: boolean = false;
    @Prop() messagesToDisplay: number = 3;
    @Prop() second: number = 1000;
    @Prop() minute: number = 60 * this.second;
    @Prop() hour: number = 60 * this.minute;

    @Event({
        eventName: 'openFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) openFeedbackHandler: EventEmitter
    @Event({
        eventName: 'showFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) showFeedbackHandler: EventEmitter
    @Listen('closeFeedback')
    closeFeedbackHandler(closeData) {
        if (this.alertOpened) {
            this.alertOpened = false;
        }
        const deleteIndex = this._messagesContent.indexOf(closeData.detail)
        if (deleteIndex > -1) {
            this._messagesContent.splice(deleteIndex, 1)
            this._messagesContent = this._messagesContent.slice()
            if (this._messagesQueue.length > 0) {
                this._messagesContent = [...this._messagesContent, this._messagesQueue.shift()]
            }
        }
    }

    componentWillLoad() {
        this.openFeedbackHandler.emit((message) => {
            this.alertOpened = true;
            console.log(message)
            if (message instanceof Array) {
                message.forEach(mes => {
                    this.addToMessageArray.bind(this)(mes)
                });
            } else {
                this.addToMessageArray.bind(this)(message)
            }
        })
    }

    timerToShow(message) {
        if (this._messagesContent.length > 0) {
            const time = new Date().getTime();
            const time2 = message.timer;
            if (Math.floor((time - time2) / this.second) < 60) {
                this.timeMeasure = 'seconds'
                this.timer = Math.floor((time - time2) / this.second)
                setTimeout(() => {
                    this.timerToShow.bind(this)(message)
                }, 500)
            } else if (Math.floor((time - time2) / this.minute) < 60) {
                this.timer = Math.floor((time - time2) / this.minute)
                this.timeMeasure = 'minutes'
                setTimeout(() => {
                    this.timerToShow.bind(this)(message)
                }, 40000)
            } else {
                this.timer = Math.floor((time - time2) / this.hour)
                this.timeMeasure = 'hours'
                setTimeout(() => {
                    this.timerToShow.bind(this)(message)
                }, 3000000)
            }
        } else {
            return;
        }
    }

    addToMessageArray(content) {
        const date = new Date();
        const messageToAdd: Message = {
            content: content,
            timer: date.getTime()
        }
        if (this._messagesContent.length + 1 <= this.messagesToDisplay) {
            this._messagesContent = [...this._messagesContent, messageToAdd]
        } else {
            this._messagesQueue = [...this._messagesQueue, messageToAdd]
        }
    }
    showOneAlert() {
        this.opened = true;
        this.showFeedbackHandler.emit('Example!')
    }
    showThreeAlerts() {
        this.opened = true;
        this.showFeedbackHandler.emit(['SPIDERMAN!', 'BEST!', 'AVENGER!'])
    }
    render() {
        let alertMessages = [];
        this._messagesContent.forEach((message) => {
            this.timerToShow.bind(this)(message)
            console.log(message)
            alertMessages.push(
                <psk-ui-feedback opened={this.opened} message={message} type-of-alert='toast' timeSinceCreation={this.timer} timeMeasure={this.timeMeasure} />
            )
        });
        return (
            <div>
                <button onClick={this.showOneAlert.bind(this)}>Show One Alert!</button>
                <button onClick={this.showThreeAlerts.bind(this)}>Show Three Alerts!</button>
                {alertMessages ? alertMessages : null}
            </div>

        )

    }
}