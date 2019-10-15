import { Component, h, Prop } from '@stencil/core';
import { WizardStep } from '../../interfaces/Wizard';

@Component({
    tag: 'psk-stepper'
})
export class PskStepper {

    @Prop() componentRender: string = "psk-stepper-renderer";
    @Prop() wizardSteps: WizardStep[];
    @Prop() activeStep: WizardStep;
    @Prop() handleStepChange: Function;

    render() {
        const StepperComponentRenderer: string = this.componentRender;
        
        return <StepperComponentRenderer
            wizardSteps={this.wizardSteps}
            activeStep={this.activeStep}
            handleStepChange={this.handleStepChange} />
    }
}