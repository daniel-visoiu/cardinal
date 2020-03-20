import { Component, h, Prop } from "@stencil/core";
import Config from "./Config.js";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import CustomTheme from '../../decorators/CustomTheme.js';

@Component({
    tag: "psk-highlight"
})

export class PskDescription {

    @CustomTheme()
    @TableOfContentProperty({
        description: `This property is the title of the new psk-card/psk-chapter that will be created.`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() title: string = "";

    @TableOfContentProperty({
        description: `This property is the type of highlight. Possible values are: "note", "issue", "example"`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() typeOfHighlight: string = Config.HIGHLIGHT_NOTE

    render() {
        return (
            <div class={`psk-highlight psk-highlight-${this.typeOfHighlight}`}>
                <div class="header">
                    {this.title}
                </div>
                <div class="body">
                    <slot />
                </div>
            </div>
        )
    }
}
