import {Component, Prop, Element, State, h, Event, EventEmitter} from '@stencil/core';
import {TableOfContentProperty} from '../../decorators/TableOfContentProperty';
import {normalizeModelChain} from "../../utils/utilFunctions";

@Component({
  tag: 'psk-for-each'
})
export class PskForEach {

  @Element() private __host: HTMLElement;
  @State() modelChanged: boolean = false;
  @State() model;
  @State() chain = "";

  @Event({
    eventName: 'getModelEvent',
    cancelable: true,
    composed: true,
    bubbles: true,
  }) getModelEvent: EventEmitter;

  private ignoredNodeNames = ["link", "style", "slot", "#text", "#comment", "text", "comment"];
  private templateNodes = [];
  private emptyNode: Element;


  prepareTemplate(){
    let childNodes = Array.from(this.__host.childNodes);

    let children = childNodes.filter((node) => {
      return (this.ignoredNodeNames.indexOf(node.nodeName.toLowerCase()) === -1)
    });

    //get the template for item rendering
    let templateChildren = children.filter((node: Element) => {
      return !node.hasAttribute("slot");
    });
    //get the template for "no data available"
    let emptyNode = children.find((node: Element) => {
      return node.hasAttribute("slot") && node.getAttribute("slot") === "no-data";
    }) as Element;

    if (emptyNode) {
      emptyNode.removeAttribute("slot");
      this.emptyNode = emptyNode.cloneNode(true) as Element;
    }

    //empty the host
    this.__host.innerHTML = "";
    if (templateChildren) {
      templateChildren.forEach(child => {
        this.templateNodes.push(child.cloneNode(true));
      })

    } else {
      console.error("No template found!")
    }
  }

  componentWillLoad():Promise<any> {

    if(!this.__host.isConnected){
      return;
    }

    this.chain = this.dataViewModel;
    this.chain = normalizeModelChain(this.chain);
    this.prepareTemplate();


    return new Promise((resolve) => {
      this.getModelEvent.emit({
        callback: (err, model) => {
          if (err) {
            console.log(err);
          }
          this.model = model;
          this.model.onChange(this.chain, () => {
            this.modelChanged = !this.modelChanged;
          });
          resolve();
        }
      })
    });
  }

  render() {

    //check if component is no longer attached to DOM
    if (!this.__host.isConnected) {
      return null;
    }
    //check if template is ready
    if (!this.templateNodes) {
      return null;
    }

    let model = this.model.getChainValue(this.chain);
    if (!model) {
      model = [];
    }

    let childList = [];
    for (let i = 0; i < model.length; i++) {
      let currentChain = this.chain ? `${this.chain}.${i}` : `${i}`;

      this.templateNodes.forEach(node => {
        let clonedTemplate: Element = node.cloneNode(true) as Element;
        this.__processNode(clonedTemplate, currentChain);

        let NewNodeTag: string = clonedTemplate.tagName.toLowerCase();
        let attributes: any = {};
        clonedTemplate.getAttributeNames().forEach(attrName => {
          attributes[attrName] = clonedTemplate.getAttribute(attrName);
        });

        let newElement: Element = <NewNodeTag innerHTML={clonedTemplate.innerHTML} {...attributes} />;
        childList.push(newElement);
      });
    }

    if (childList.length === 0 && this.emptyNode) {
      return <div innerHTML={this.emptyNode.outerHTML}></div>
    }

    return childList;
  }

  __processNode(node: Element, chain: string): void {

    function processAttribute(attributeName, attributeValue) {
      let splitChain = attributeValue.trim().split("@");
      let property = splitChain.pop();
      let fullChain = chain;
      if(chain && property.length>0){
        fullChain = `${chain}.${property}`
      }
      node.setAttribute(attributeName, "@" + fullChain);
    }

    /*
      process view-model attribute
      keep in mind that this attribute accepts models that can begin or not with '@'
     */
    let viewModelAttribute = node.getAttribute("view-model");

    if(viewModelAttribute){
      processAttribute("view-model", viewModelAttribute);
    }

    //process component specific attributes
    let modelAttrs = Array.from(node.attributes)
      .filter((attr: Attr) => attr.value.startsWith("@") && attr.name!=="view-model");

    modelAttrs.forEach((attr: Attr) => {
      processAttribute(attr.name, attr.value);
    });

    if(node.tagName.toLowerCase()!=="psk-for-each"){
      Array.from(node.children).forEach((node: Element) => {
        this.__processNode.call(this, node, chain);
      });
    }
  }


  @TableOfContentProperty({
    description: [`This property is the name of the model which will be used to generate the form. The model should be a JavaScript array.`,
      `All the information about how to write a model, hot to use the two-way binding and how to use the model with this component cand be found in the documentation found at: <psk-link page="forms/using-forms">Using forms</psk-link>`],
    isMandatory: true,
    propertyType: 'string',
    specialNote: [`If this property is not provided, nothing written inside the component's template will be displayed.`]
  })
  @Prop({attribute: "data-view-model"}) dataViewModel?: string | null = null;
}
