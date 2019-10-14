export interface WizardStep {
    stepName: string;
    stepIndex: number;
    stepComponent: string;
    stepCompleted?: boolean;
    stepProperties?: any;
}