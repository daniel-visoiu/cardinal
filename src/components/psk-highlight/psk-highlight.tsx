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
        description: `The title of the highlighted section.`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() title: string = "";

    @TableOfContentProperty({
        description: `This property is the type of highlight. Possible values are: "note", "issue", "example". Defaults to "note".`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() typeOfHighlight: string = Config.HIGHLIGHT_NOTE

    render() {
        return (
            <div class={`psk-highlight psk-highlight-${this.typeOfHighlight}`}>
              {this.title ? <div class="header">
                {this.title}
              </div> : null}
                <div class="body">
                    <slot />
                </div>
            </div>
        )
    }
}