import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { WizardStep } from '../../interfaces/Wizard';

@Component({
    tag: 'psk-wizard',
    styleUrl: './psk-wizard.css'
})
export class PskWizard {

    @Prop({ mutable: true, reflect: true }) wizardSteps?: WizardStep[];

    @State() activeStep: WizardStep;

    componentWillLoad() {
        this.needWizardConfiguration.emit((data) => {
            this.wizardSteps = data;
            this.activeStep = this.wizardSteps.length > 0 ? this.wizardSteps[0] : null;
        });
    }

    @Event({
        eventName: 'needWizardConfiguration',
        cancelable: true,
        composed: true,
        bubbles: true,
    }) needWizardConfiguration: EventEmitter;

    @Event({
        eventName: "changeStep",
        bubbles: true,
        cancelable: true,
        composed: true
    }) changeStep: EventEmitter;

    @Event({
        eventName: "finishWizard",
        bubbles: true,
        cancelable: true,
        composed: true
    }) finishWizard: EventEmitter;

    handleStepChange(indexToAdvance: number) {
        this.changeStep.emit({
            stepIndexToDisplay: indexToAdvance,
            wizardSteps: this.wizardSteps,
            activeStep: this.activeStep,
            callback: (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.activeStep = data.activeStep;
                this.wizardSteps = data.wizardSteps;
            }
        });
        return;
    }

    handleFinish(): void {
        this.finishWizard.emit({
            wizardSteps: this.wizardSteps,
            callback: (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(data);
            }
        });
        return;
    }

    handleStepPropertiesChange(newProperties: any): void {
        this.activeStep["stepProperties"] = newProperties;
    }

    computeStepDesign(stepIndex: number, activeStepIndex: number, lastStepIndex: number): string {
        let stepClass: string = "";

        if (stepIndex === 0) {
            stepClass += "first ";
        } else if (stepIndex === lastStepIndex - 1) {
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
        const StepComponentRenderer = this.activeStep.stepComponent;

        return [
            <div class="page-content">
                <div class="wizard-content">
                    <div class="wizard-form">
                        <form class="form-register" action="#" method="post"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                ev.stopImmediatePropagation();
                            }} >
                            <div id="form-total" role="application" class="wizard clearfix vertical">

                                <div class="steps clearfix">
                                    <ul role="tablist">
                                        {this.wizardSteps.map((step: WizardStep) => (
                                            <li role="tab" class={this.computeStepDesign(step.stepIndex, this.activeStep.stepIndex, this.wizardSteps.length)}>
                                                <button id={`step-${step.stepIndex}`}
                                                    onClick={this.handleStepChange.bind(this, step.stepIndex)}>
                                                    <span class="current-info audible"></span>
                                                    <div class="title">
                                                        <p class="step-icon"><span>{step.stepIndex + 1}</span></p>
                                                        <div class="step-text">
                                                            <span class="step-inner">{step.stepName}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <StepComponentRenderer
                                    onPropertiesChange={this.handleStepPropertiesChange.bind(this)}
                                    stepProperties={this.activeStep.stepProperties} />

                                <div class="actions clearfix">
                                    <ul role="menu" aria-label="Pagination">
                                        {this.activeStep.stepIndex > 0
                                            ? <li>
                                                <button role="menuitem"
                                                    onClick={this.handleStepChange.bind(this, this.activeStep.stepIndex - 1)}>Previous</button>
                                            </li>
                                            : null}

                                        {this.activeStep.stepIndex < this.wizardSteps.length - 1
                                            ? <li>
                                                <button role="menuitem"
                                                    onClick={this.handleStepChange.bind(this, this.activeStep.stepIndex + 1)}>Next</button>
                                            </li>
                                            : null}

                                        {this.activeStep.stepIndex === this.wizardSteps.length - 1
                                            ? <li>
                                                <button role="menuitem"
                                                    onClick={this.handleFinish.bind(this)}>Finish</button>
                                            </li>
                                            : null}
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ]
    }
}