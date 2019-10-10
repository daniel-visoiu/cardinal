export interface WizardComponent {
    componentName: string;
    componentProps?: Object;
    children?: WizardRow[];
}

export interface WizardInformation {
    step: WizardStep;
    information: Object;
}

export interface WizardRow {
    row: WizardComponent[];
}

export interface WizardStep {
    stepName: string;
    stepComponent: WizardRow[];
    stepIndex: number;
}