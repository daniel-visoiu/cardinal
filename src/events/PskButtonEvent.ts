import {EVENTS_TYPES} from "../utils/constants";

const EVENT_TYPE = EVENTS_TYPES.PSK_BUTTON_EVT;

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
