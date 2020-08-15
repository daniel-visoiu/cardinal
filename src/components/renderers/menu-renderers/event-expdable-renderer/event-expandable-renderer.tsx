import {Component, h, Prop, State, Element} from '@stencil/core';
import {injectHistory, RouterHistory} from "@stencil/router";
import SubMenuItemsEvent from "../../../../events/SubMenuItemsEvent";

@Component({
  tag: 'event-expandable-renderer',
  shadow: false
})

export class ExpandableRenderer {

  @Prop({
    reflect: true,
  }) active: boolean;
  @State() isOpened = false;
  @Prop() url;
  @State() dropDownHasChildActive = false;
  @Prop() somethingChanged = false;
  @Prop() firstMenuChild :any;
  @Prop() history: RouterHistory;
  @Prop() item: any;


  @State() isClosed = true;
  @State() lazyItems = [];
  @State() eventWasResolved = false;
  @Element() _host;


   loadSubMenuItems(){


     let eventCallbackHandler = (err, items) => {

       if (err) {
         throw new Error(err);
       }

       let arr = [];
       items.forEach(item => {
         arr.push(
           <stencil-route-link url={item.path} activeClass="active" exact={false}>
             <div class="wrapper_container">
               <div class="item_container">
                 <span class={`icon fa ${item.icon}`}></span>
                 <span class="item_name">{item.name}</span>
               </div>
             </div>
           </stencil-route-link>
         );
       });
       this.lazyItems = arr;
       this.eventWasResolved = true
     };

     if (this.item.children.event) {
       let event = new SubMenuItemsEvent(this.item.children.event, {
         pathPrefix: this.item.path,
         callback: eventCallbackHandler
       }, {
         cancelable: true,
         composed: true,
         bubbles: true,
       });

       this._host.dispatchEvent(event);
     }
  }

  componentDidLoad(){

    this._host.addEventListener("click",()=>{
      this.isClosed = false;
      this.loadSubMenuItems();
    });

  }

  render() {
    return (
      <div class="children">
        {this.isClosed?null:this.lazyItems.length?this.lazyItems:this.eventWasResolved?
        <div class="menu-loader"><i class="small">No item found.</i></div>:<div class="menu-loader">Loading...</div>}
      </div>

    )
  }
}
injectHistory(ExpandableRenderer);
