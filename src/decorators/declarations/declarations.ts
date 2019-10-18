export interface TableOfContentClass {
    (opts?: ClassOptions);
}
export interface ClassOptions {
    className: string;
    description: string;
    componentTag: string;
}

export interface TableOfContentMethod {
    (opts?: MethodOptions): MethodDecorator;
}
export interface MethodOptions {
    methodName?: string;
    description?: string;
}

export interface TableOfContentProperty {
    (opts?: PropertyOptions): PropertyDecorator;
}
export interface PropertyOptions {
    propertyName?: string;
    description?: string;
    instance?: any;
}

export interface TableOfContentParameter {
    (opts?: ParameterOptions): ParameterDecorator;
}
export interface ParameterOptions {
    parameterName: string;
    description: string;
}