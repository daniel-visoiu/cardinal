import { Component, h, Prop } from "@stencil/core";
import Config from "./Config.js";
import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import CustomTheme from '../../decorators/CustomTheme';

@Component({
    tag: "psk-highlight",
    styleUrls:["./psk-highlight.css","../../assets/css/bootstrap/bootstrap.css"]
})

export class PskHighlight {

    @CustomTheme()
    @TableOfContentProperty({
        description: `The title of the highlighted section.`,
        isMandatory: false,
        propertyType: `string`
    })
    @Prop() title: string = "";

    @TableOfContentProperty({
        description: `This property is the type of highlight. Possible values are: "note", "issue", "example", "warning". Defaults to "note".`,
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
