import {Component,h, Prop, Element, Event, EventEmitter, State} from '@stencil/core'
@Component({
    tag: "psk-ui-feedback",
    styleUrl: '../../themes/default/assets/bootstrap/css/bootstrap.min.css',
    shadow: true
}) 

export class AlertComponent{
    @Prop({reflectToAttr: true, mutable: true}) typeOfAlert : string ="succes-alert" 
    @Prop() message : any
    @Prop() timeSinceCreation : number
    @Prop() timeMeasure: string ='seconds';
    @State() hideOrShow: string = "toast fade hide"
    @State() alert : any = null;
    @Element() element: HTMLElement
    @Event({
        eventName: 'closeFeedback',
        composed: true,
        cancelable: true,
        bubbles: true,
    }) closeFeedback: EventEmitter
    private createAlert() {
        console.log('OK!')
        if(this.typeOfAlert === 'success-alert' || this.typeOfAlert === 'danger-alert' ){
            this.alert =(
                <div class={`${this.hideOrShow}`} role="alert" id='alert'>
                    <slot/>
                    <button 
                    type="button" 
                    class="close" 
                    data-dismiss="alert" 
                    aria-label="Close"
                    onClick={() => {
                        this.closeFeedback.emit(this.message)
                    }}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="toast-body">
                        {this.message.content}
                    </div>
                </div>
                )
        } else {
            this.alert=(
                <div role="alert" aria-live="assertive" aria-atomic="true" class={`${this.hideOrShow}`}>
                    <div class="toast-header">
                        <strong class="mr-auto">Bootstrap</strong>
                        <small>{this.timeSinceCreation} {this.timeMeasure} ago</small>
                        <button 
                            type="button" 
                            class="ml-2 mb-1 close" 
                            data-dismiss="toast" 
                            aria-label="Close" 
                            onClick={() => {
                                this.closeFeedback.emit(this.message)
                            }}
                            >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                        {this.message.content}
                    </div>
                </div>
            )
        }
        console.log(this.alert)
    }
    render(){
        if(this.typeOfAlert ==='success-alert'){
            console.log('So you want a succes alert ayy?')
            this.hideOrShow = "alert alert-success alert-dismissible fade show"
            this.createAlert()
       } else if(this.typeOfAlert ==='danger-alert'){
            console.log('You shall not pass!')
            this.hideOrShow = "alert alert-danger alert-dismissible fade show"
            this.createAlert()
       } else if(this.typeOfAlert ==='toast'){
            console.log('Toasted not burned!')
            this.hideOrShow= "toast fade show"
            this.createAlert()
       } else {
            console.log('Not the correct type of alert!')
            throw Error('not correct alert!')
       }
        return (
            this.alert
        )
    }
}