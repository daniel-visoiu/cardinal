import { h, Component, Prop } from '@stencil/core';

import { BindModel } from '../../decorators/BindModel';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';

import { DATE_FORMAT_MASKS } from '../../utils/constants';
import DateFormat from '../../controllers/base-controllers/lib/DateFormat';

@Component({
    tag: 'psk-date'
})
export class PskDate {

    @CustomTheme()
    @BindModel() modelHandler;

    @TableOfContentProperty({
        description: ['Specifies the value of the date to be formatted.',
            'It can be a string representation of the date, but also can be the timestamp value of the date.',
            'The string representation of the date must comply with the documentation of the Date object available on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date'],
        isMandatory: true,
        propertyType: 'string | number'
    })
    @Prop() value: string | number | null = null;

    @TableOfContentProperty({
        description: ['Specifies how to format the displayed date according to the above described available formats.'],
        isMandatory: false,
        propertyType: 'string',
        defaultValue: 'mm dd yyyy'
    })
    @Prop() format: string | null = 'mm dd yyyy';

    @TableOfContentProperty({
        description: ['This property is used to display a tooltip of the formatted date when hover the displayed date. This is very useful when you want to display a more detailed date for the user.'],
        isMandatory: false,
        propertyType: 'string',
        defaultValue: 'No default value'
    })
    @Prop() hoverFormat: string | null = DATE_FORMAT_MASKS.default;

    render() {
        if (!new Date(this.value).getTime()) {
            return null;
        }

        const formattedDate = new DateFormat(this.value).applyFormat(this.format);
        const hoverFormattedDate = new DateFormat(this.value).applyFormat(this.hoverFormat);

        return <psk-label label={formattedDate} title={hoverFormattedDate} />;
    }
}
