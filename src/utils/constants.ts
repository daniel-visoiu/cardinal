export const HELP_PROPERTY: string = "with-help";

export const BASE_CLASS: string = "baseClass";
export const DEFINED_PROPERTIES: string = "definedProperties";
export const DEFINED_EVENTS: string = "definedEvents";
export const DEFINED_CONTROLLERS: string = "definedControllers";

export const DATA_DEFINED_PROPS: string = "data-define-props";
export const DATA_DEFINED_EVENTS: string = "data-define-events";
export const DATA_DEFINED_CONTROLLERS: string = "data-define-controller";

export const TOOLTIP_TEXT: string = "Copy to clipboard";
export const TOOLTIP_COPIED_TEXT: string = "Copied!";
export const LIST_TYPE_ORDERED: string = "ordered";
export const LIST_TYPE_UNORDERED: string = "unordered";

export const EVENTS_TYPES = {
  PSK_BUTTON_EVT:"PSK_BUTTON_EVT",
  PSK_SCROLL_EVT:"PSK_SCROLL_EVT",
  PSK_WIZARD_EVT:"PSK_WIZARD_EVT",
  PSK_FILE_CHOOSER_EVT:"PSK_FILE_CHOOSER_EVT"
};

export const PSK_LIST_PARSE_CONFIG = {
  startTag: /^<([a-z]+-?[a-z]*)+[^>]*>/,
  endTag: /^<\/([a-z]+-?[a-z]*)+[^>]*>/
};

export const ACTIONS_ICONS = {
  view: {
    value: "eye",
    color: "rgba(108, 192, 145, 1)"
  },
  edit: {
    value: "edit",
    color: "#007bff"
  },
  cancel: {
    value: "close",
    color: "#dc3545"
  },
  bid: {
    value: "gavel"
  },
  calendar: {
    value: "calendar-check-o"
  }
};

export const GRID_IGNORED_COMPONENTS = ["link", "psk-for-each"];

export const GRID_BREAKPOINTS = ["xs", "s", "m", "l", "xl"];

export const GRID_HIDDEN_BREAKPOINTS = {
  xs: "d-none d-sm-block",
  sm: "d-sm-none d-md-block",
  md: "d-md-none d-lg-block",
  lg: "d-lg-none d-xl-block",
  xl: "d-xl-none"
};
