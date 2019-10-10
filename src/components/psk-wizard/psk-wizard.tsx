import { Component, h, Prop, State } from '@stencil/core';
import { WizardStep, WizardInformation } from '../../interfaces/Wizard';

@Component({
    tag: 'psk-wizard',
    styleUrl: './psk-wizard.css',
    shadow: true
})
export class PskWizard {

    @Prop() wizardSteps: WizardStep[];

    @State() wizardInformation: WizardInformation[];
    @State() currentWizardStep: WizardStep;

    componentWillLoad() {
        if (!this.currentWizardStep && this.wizardSteps.length > 1) {
            this.currentWizardStep = this.wizardSteps[1];
        }
    }

    render() {
        if (!this.currentWizardStep) {
            return null;
        }

        let stepHeader = null;
        if (this.wizardSteps.length > 0) {
            stepHeader = this.wizardSteps.map((step: WizardStep) => {
                let stepClass: string = step.stepIndex === 1 ? "first " : step.stepIndex === this.wizardSteps.length ? "last " : "";

                if (step.stepIndex < this.currentWizardStep.stepIndex) {
                    stepClass += "done";
                }
                if (step.stepIndex === this.currentWizardStep.stepIndex) {
                    stepClass += "current";
                }

                return (
                    <li role="tab" class={stepClass}>
                        <a id="form-total-t-0" href="#form-total-h-0" aria-controls="form-total-p-0">
                            <span class="current-info audible"></span>
                            <div class="title">
                                <p class="step-icon"><span>{step.stepIndex}</span></p>
                                <div class="step-text">
                                    <span class="step-inner-1">{step.stepName}</span>
                                </div>
                            </div>
                        </a>
                    </li>
                );
            });
        }

        return (
            <div class="page-content">
                <div class="wizard-content">
                    <div class="wizard-form">
                        <form class="form-register">
                            <div id="form-total" role="application" class="wizard clearfix vertical">

                                <div class="steps clearfix">
                                    <ul role="tablist">
                                        {stepHeader}
                                    </ul>
                                </div>

                                <div class="content clearfix">
                                    <section id="form-total-p-0" role="tabpanel" aria-labelledby="form-total-h-0" class="body current" aria-hidden="false" >
                                        <div class="inner">
                                            <div class="wizard-header">
                                                <h3 class="heading">Account Setup</h3>
                                            </div>
                                            <div class="form-row">
                                                <div class="form-holder form-holder-2">
                                                    <label htmlFor="your_email">Email Address</label>
                                                    <input type="email" name="your_email" id="your_email" class="form-control" pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" placeholder="Your Email" required />
                                                </div>
                                            </div>
                                            <div class="form-row">
                                                <div class="form-holder form-holder-2">
                                                    <label htmlFor="password">Password</label>
                                                    <input type="password" name="password" id="password" class="form-control" placeholder="Password" required />
                                                </div>
                                            </div>
                                            <div class="form-row">
                                                <div class="form-holder form-holder-2">
                                                    <label htmlFor="confirm_password">Confirm Password</label>
                                                    <input type="password" name="confirm_password" id="confirm_password" class="form-control" placeholder="Password" required />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}