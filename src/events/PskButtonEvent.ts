const EVENT_TYPE = "PskButtonClickEvent";

export default class PskButtonEvent extends CustomEvent<any> {
  public data: any;
  public getEventType = function() {
    return EVENT_TYPE;
  };

  constructor(eventName: string, eventData: any, eventOptions: EventInit) {
    super(eventName, eventOptions);
    this.data = eventData;
  }
}
