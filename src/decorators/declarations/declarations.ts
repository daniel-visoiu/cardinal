export interface EventOptions {
    // The name of the event. This is automatically filled in using the decorator
    eventName?: string;
    description: string | Array<string>;
    controllerInteraction?: ControllerOptions;
    specialNote?: string | Array<string>;
}

export interface PropertyOptions {
    // The name of the property. This is automatically filled in using the decorator
    propertyName?: string;
    description: string | Array<string>;
    specialNote?: string | Array<string>;
    isMandatory: boolean;
    propertyType: string;
    defaultValue?: any
}

export interface ControllerOptions {
    required: boolean
}