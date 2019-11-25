import { Component, h, Prop } from '@stencil/core';
import { WizardStep } from '../../interfaces/Wizard';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

@Component({
    tag: 'psk-stepper-renderer',
    shadow: true
})
export class PskStepperRenderer {
    @CustomTheme()
    @TableOfContentProperty({
        description: `This property holds an array of:
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
        description: `The WizardStep created by psk-wizard and passed on by psk-stepper.`,
        isMandatory: true,
        propertyType: `WizardStep`
    })
    @Prop() activeStep: WizardStep;

    @TableOfContentProperty({
        description: `This property is a function that modifies the way the step change is interpreted.`,
        isMandatory: true,
        propertyType: `Function`
    })
    @Prop() handleStepChange: Function;

    computeStepDesign(stepIndex: number, activeStepIndex: number, lastStepIndex: number): string {
        let stepClass: string = "";

        if (stepIndex === 0) {
            stepClass += "first ";
        } else if (stepIndex === lastStepIndex) {
            stepClass += "last ";
        }

        if (stepIndex < activeStepIndex) {
            stepClass += "done";
        } else if (stepIndex === activeStepIndex) {
            stepClass += "current";
        }

        return stepClass;
    }

    render() {

        return (
            <div class="steps clearfix">
                <ul role="tablist">
                    {this.wizardSteps.map((step: WizardStep) => (
                        <li role="tab" class={this.computeStepDesign(step.stepIndex, this.activeStep.stepIndex, this.wizardSteps.length - 1)}>
                            <div class="button" onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopImmediatePropagation()
                                this.handleStepChange(step.stepIndex);
                            }}>
                                <span class="current-info audible"></span>
                                <div class="title">
                                    <p class="step-icon"><span>{step.stepIndex + 1}</span></p>
                                    <div class="step-text">
                                        <span class="step-inner">{step.stepName}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
