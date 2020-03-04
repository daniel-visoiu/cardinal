const EVENT_TYPE = "PskScrollEvent";

export default class PskScrollEvent extends CustomEvent<any> {
  public parentEventData: any;
  public getEventType = function() {
    return EVENT_TYPE;
  };

  constructor(
    eventName: string,
    parentEventData: any,
    eventOptions: EventInit
  ) {
    super(eventName, eventOptions);
    this.parentEventData = parentEventData;
  }
}
