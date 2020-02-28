import { Component, Prop } from "@stencil/core";
// import { TableOfContentProperty } from "../../decorators/TableOfContentProperty";
import { BindModel } from '../../decorators/BindModel';

@Component({
    tag: "psk-condition"
})
export class PskCondition {
    
    @BindModel()

    @Prop() condition: string | null = null

    render() {
        console.log(this.condition)
        if (this.condition) {
            return "WORKING!"
        } else
            return null;
    }
} 