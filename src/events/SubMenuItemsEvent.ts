import {EVENTS_TYPES} from "../utils/constants";

const EVENT_TYPE = EVENTS_TYPES.PSK_SUB_MENU_EVT;

export default class SubMenuItemsEvent extends CustomEvent<any> {
  public data: any;
  public getEventType = function() {
    return EVENT_TYPE;
  };

  constructor(eventName: string, eventData: any, eventOptions: EventInit) {
    super(eventName, eventOptions);
    this.data = eventData;
  }
}
