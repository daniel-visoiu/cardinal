import { Component, h, Prop } from '@stencil/core';
import { WizardStep } from '../../interfaces/Wizard';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';

@Component({
    tag: 'psk-stepper'
})
export class PskStepper {

    @TableOfContentProperty({
        description:`This property is the string that defines the psk-stepper render passed on by the psk-wizard.`,
        isMandatory: false,
        propertyType: `string`,
        defaultValue: `psk-stepper-renderer`
    })
    @Prop() componentRender: string = "psk-stepper-renderer";

    @TableOfContentProperty({
        description:`This parameter holds an array of:
            wizard configuration
            the names of the steps
            the components that will be displayed
            other properties, like information for the steps.(optional).`,
        isMandatory: false,
        propertyType: `array for WizardStep items(WizardStep[])`,
        defaultValue: `psk-stepper-renderer`
    })
    @Prop() wizardSteps: WizardStep[];

    @TableOfContentProperty({
        description: `The WizardStep created by psk-wizard.`,
        isMandatory: true,
        propertyType: `WizardStep`
    })
    @Prop() activeStep: WizardStep;

    @TableOfContentProperty({
        description: `This property is a function that modifies the way the step change is interpreted in the renderer.`,
        isMandatory: true,
        propertyType: `Function`
    })
    @Prop() handleStepChange: Function;

    render() {
        const StepperComponentRenderer: string = this.componentRender;

        return <StepperComponentRenderer
            wizardSteps={this.wizardSteps}
            activeStep={this.activeStep}
            handleStepChange={this.handleStepChange} />
    }
}
