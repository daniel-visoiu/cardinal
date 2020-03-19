import {Component, h, Prop, State, Element} from '@stencil/core';
import {injectHistory, RouterHistory} from "@stencil/router";
import SubMenuItemsEvent from "../../../../events/SubMenuItemsEvent";

@Component({
  tag: 'event-expandable-renderer',
  shadow: false
})

export class ExpandableRenderer {

  @Prop({
    reflectToAttr: true,
  }) active: boolean;
  @State() isOpened = false;
  @Prop() url;
  @State() dropDownHasChildActive = false;
  @Prop() somethingChanged = false;
  @Prop() firstMenuChild :any;
  @Prop() history: RouterHistory;
  @Prop() event: string;

  @State() isClosed = true;
  @State() lazyItems = [];
  @Element() _host;


   loadSubMenuItems(){

     if(this.event){
       let event = new SubMenuItemsEvent(this.event, (err,items) =>{

         if(err){
            throw new Error(err);
         }

         let arr = [];
         items.forEach(item=>{
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
       },{
         cancelable:true,
         composed:true,
         bubbles:true,
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
      this.isClosed?null:this.lazyItems.length?this.lazyItems:<div class="menu-loader">Loading...</div>
    )
  }
}
injectHistory(ExpandableRenderer);
