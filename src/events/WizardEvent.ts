const EVENT_TYPE = "WizardStepEvent";

export default class WizardEvent extends CustomEvent<any> {
  public data: any;
  public getEventType = function() {
    return EVENT_TYPE;
  };

  constructor(eventName: string, eventData: any, eventOptions: EventInit) {
    super(eventName, eventOptions);
    this.data = eventData;
  }
}
