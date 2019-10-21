export interface ClassOptions {
    className: string;
    description: string | Array<string>;
    componentTag: string;
}

export interface MethodOptions {
    // The name of the method. This is automatically filled in using the decorator
    methodName?: string | symbol;
    description: string | Array<string>;
    specialNote?: string | Array<string>;
}

export interface PropertyOptions {
    // The name of the property. This is automatically filled in using the decorator
    propertyName?: string | symbol;
    description: string | Array<string>;
    specialNote?: string | Array<string>;
    mandatory: boolean;
}