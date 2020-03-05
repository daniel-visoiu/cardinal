import {EVENTS_TYPES} from "../utils/constants";

const EVENT_TYPE = EVENTS_TYPES.PSK_SCROLL_EVT;

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
