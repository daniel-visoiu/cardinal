import {h, Component, Prop, getElement, State} from '@stencil/core';
import {BindModel} from "../../decorators/BindModel";


@Component({
    tag: 'psk-label-test'
})
export class PskLabelTest {

  @BindModel() modelHandler;

      connectedCallback = function () {
      let thisElement = getElement(this);
      console.log("TEST: Connected", thisElement);
    };

    componentWillLoad(){
      let thisElement = getElement(this);
      console.log("TEST: WillLoad", thisElement);

      console.log(thisElement.getAttributeNames());
    }

    @Prop({attribute:"first-label"}) firstlabel;
    @Prop({attribute:"second-label"}) secondLabel;
    @Prop({attribute:"third-label"}) thirdLabel;
    @Prop({attribute:"cosmin-ursache"}) labelValue;
    @State() myState = "@ceva";



    componentDidLoad(){
      console.log("Loaded");
      let thisElement = getElement(this);
      console.log("TEST: WillLoad", thisElement);

      console.log(thisElement.getAttributeNames());
    }

    render() {


      let thisElement = getElement(this);
      console.log("TEST: WillLoad", thisElement);

      console.log(thisElement.getAttributeNames());

        return (
            <span class="col-form-label">
                # 1: {this.firstlabel}
                <br/>
                # 2: {this.secondLabel}
                <br/>
                # 3: {this.thirdLabel}
                <br/>
                # 4: {this.labelValue}
            </span>
        );
    }
}
