export interface EventOptions {
    // The name of the event. This is automatically filled in using the decorator
    eventName?: string;
    description: string | Array<string>;
    controllerInteraction?: boolean;
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

export interface ControllerOptions{
    controllerName?: string;
    description: string | Array<string>;
    specialNote?: string | Array<string>;
    events:{
        eventName: string,
        required: boolean  
    }[]
}