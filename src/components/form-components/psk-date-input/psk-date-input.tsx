import { h, Component, Prop } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import CustomTheme from '../../../decorators/CustomTheme';
@Component({
    tag: 'psk-date-input'
})
export class PskDateInput {
    @CustomTheme()
    @BindModel() modelHandler;

    render() {
        let dataDate = this.__getFormattedDate();

        return <psk-input
            type="date"
            label={this.label}
            name={this.name}
            value={dataDate}
            placeholder={this.placeholder}
            required={this.required === 'true'}
            readOnly={this.readOnly}
            invalidValue={this.invalidValue}
            specificProps={{
                onKeyUp: this.__inputHandler.bind(this),
                onChange: this.__inputHandler.bind(this),
                "data-date": dataDate,
                "data-date-format": this.dataFormat,
                class: this.dataFormat ? "form-control formated-date" : 'form-control'
            }} />
    }

    __inputHandler = (event) => {
        event.stopImmediatePropagation();
        let currentDate = event.target.value;

        const newValue = new Date(currentDate).getTime();
        this.modelHandler.updateModel('value', newValue);
    };

    __getFormattedDate = () => {
        if (this.value && this.value.trim().length) {
            let newDate = new Date(parseInt(this.value));
            const utcMonth = newDate.getUTCMonth() + 1;
            const utcDayOfMonth = newDate.getUTCDate();

            const month = utcMonth < 9 ? `0${utcMonth}` : utcMonth;
            const day = utcDayOfMonth < 9 ? `0${utcDayOfMonth}` : utcDayOfMonth;
            const dateToDisplay = `${newDate.getFullYear()}-${month}-${day}`;

            if (this.dataFormat) {
                return this.__changeDateFormat(dateToDisplay, this.dataFormat);
            } else {
                return dateToDisplay;
            }
        }
    }

    __changeDateFormat = (dateToBeFormated, dateFormat) => {
        let formatedDate = "";
        let splitedDate = dateToBeFormated.split("-");
        let splitedFormat = dateFormat.trim().split(" ");
        let dateVariables = {
            "MM": splitedDate[1],
            "DD": splitedDate[2],
            "YYYY": splitedDate[0]
        }
        splitedFormat.forEach((type, index) => {
            if (dateVariables.hasOwnProperty(type)) {
                formatedDate += dateVariables[type];
                if (index < splitedFormat.length - 1) {
                    formatedDate += "/"
                }
            }
        });
        return formatedDate;
    }

    @TableOfContentProperty({
        description: [`By filling out this property, the component will display above it, a label using <psk-link page="forms/psk-label">psk-label</psk-link> component.`],
        isMandatory: false,
        propertyType: 'string',
        specialNote: `If this property is not provided, the component will be displayed without any label`
    })
    @Prop() label?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the value of an psk-date-input component.`,
            `This value is updated also in the model using the two-way binding. Information about two-way binding using models and templates can be found at: <psk-link page="forms/using-forms">Using forms</psk-link>.`,
            `This property should respect the format give nto the data-format property.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() value?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies the name of a psk-date-input component. It is used along with the psk-label component.`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() name?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies a short hint that describes the expected value of an psk-date-input component`],
        isMandatory: false,
        propertyType: 'string'
    })
    @Prop() placeholder?: string | null = null;

    @TableOfContentProperty({
        description: [`Specifies that an input field must be filled out before submitting the form.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() required?: string = "false";

    @TableOfContentProperty({
        description: [`	Specifies that an input field is read-only.`,
            `Accepted values: "true" and "false"`],
        isMandatory: false,
        propertyType: 'boolean',
        defaultValue: "false"
    })
    @Prop() readOnly?: boolean = false;

    @TableOfContentProperty({
        description: [`This property indicates if the value entered by the user is a valid one according to some validation present in the controller.`],
        isMandatory: false,
        propertyType: 'boolean'
    })
    @Prop() invalidValue?: boolean | null = null;

    @TableOfContentProperty({
        isMandatory: false,
        description: `This property is the format of the date.At the moment the component can format only "MM DD YYYY", "DD MM YYYY", "MM YYYY DD", "YYYY MM DD", "YYYY DD MM"   and "DD YYYY MM".`,
        propertyType: 'string',
        defaultValue: "null"
    })
    @Prop() dataFormat?: string | null = null

}
