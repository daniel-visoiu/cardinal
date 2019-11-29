export type Option = SelectOption | RadioOption;
export type RowType = 'normal' | 'wide';
export type FormActionType = 'submit' | 'reset';
export type FormComponentType = 'psk-input' | 'psk-radio' | 'psk-checkbox' | 'psk-select';

export interface SelectOption {
    optionName: string;
    selected?: boolean;
    // Will be more in here...
};

export interface RadioOption {
    optionName: string;
    selected?: boolean
    // Will be more in here...
};

export interface FormAction {
    acitonName: string;
    eventName?: string;
    actionType?: FormActionType;
};

export interface FormRow {
    row: Array<FormComponent>;
    rowType?: RowType;
};

export interface FormComponent {
    componentName: FormComponentType;

    label?: string;
    type?: string;
    defaultValue?: string;

    required?: boolean;
    readOnly?: boolean;
    /**
     * Used only for checkboxes
     */
    checked?: boolean;

    /**
     * Used for input fields
     */
    value?: string;
    /**
     * Used for input fields
     */
    placeHolder?: string;
    /**
     * Used to store the list of selected values 
     * Available only for selection list component with type multiple
     */
    values?: Array<string>;

    /**
     * Used for radio buttons and selection lists
     */
    options?: Array<Option>;

    /**
     * This property will be filled inside controller if the component does not pass the validation step 
     */
    invalidValue?: boolean;
};

/**
 * The base for a form
 * Each form will need a FormModel in order to be generated
 */
export interface FormModel {
    components: Array<FormRow>;
    actions?: Array<FormAction>;
};