const EVENT_TYPE = "PskFileChooserSelectEvent";

export default class PskFileChooserEvent extends CustomEvent<any> {
    public data: any;
    public getEventType = function () {
        return EVENT_TYPE;
    };

    constructor(eventName: string, eventData: any, eventOptions: EventInit) {
        super(eventName, eventOptions);
        this.data = eventData;
    }
}
