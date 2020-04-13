import { Component, Prop, Element, State, h } from '@stencil/core';
import { BindModel } from '../../../decorators/BindModel';
import { TableOfContentProperty } from '../../../decorators/TableOfContentProperty';
import { DISPLAY_IF_IS, DISPLAY_IF_EXISTS } from '../../../utils/constants';
import { __isAbleToBeDisplayed } from '../../../utils/bindModelUtils';

@Component({
  tag: 'psk-for-each'
})
export class PskForEach {

  @BindModel()
  @Element() private __host: HTMLElement;
  @State() modelChanged: boolean = false;

  private ignoredNodeNames = ["link", "style", "slot", "#text", "#comment", "text", "comment"];
  private templateNodes = [];
  private emptyNode: Element;

  componentWillLoad() {

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

  componentDidLoad() {
    if (this['rootModel']) {
      this['rootModel'].onChange(this['parentChain'], () => {
        this.modelChanged = !this.modelChanged;
      });
    }
    else {
      //TODO: an error should be logged to console.
      //In this moment the TableOfContentsEvents decorator is not properly stopping this component
      //console.error("Model was not set or it wasn't found");
    }

  }

  render() {
    //check if model is ready
    if (!this['rootModel'] || !this['parentChain']) {
      return null;
    }
    //check if template is ready
    if (!this.templateNodes) {
      return null;
    }

    let model = this['rootModel'].getChainValue(this['parentChain']);
    if (!model) {
      model = [];
    }

    let childList: Element[][] = [];

    for (let i = 0; i < model.length; i++) {
      let pChain = this['parentChain'] ? `${this['parentChain']}.${i}.` : `${i}.`;

      let preparedNodes: Element[] = [];
      this.templateNodes.forEach(node => {
        let clonedTemplate: Element = node.cloneNode(true) as Element;
        let preparedNode: Element = this.prepareItem(pChain, clonedTemplate);

        let NewNodeTag: string = preparedNode.tagName.toLowerCase();
        let attributes: any = {};
        preparedNode.getAttributeNames().forEach(attrName => {
          attributes[attrName] = preparedNode.getAttribute(attrName);
        });

        let newElement: Element = <NewNodeTag innerHTML={preparedNode.innerHTML} {...attributes} />;

        preparedNodes.push(newElement)
      });

      childList.push(preparedNodes);
    }

    if (childList.length === 0 && this.emptyNode) {
      return <div innerHTML={this.emptyNode.outerHTML}></div>
    }

    return childList;
  }

  __updateDisplayConditionals(node: Element, chain: string): void {
    const displayIfIs: string = node.getAttribute(DISPLAY_IF_IS),
      displayIfExists: string = node.getAttribute(DISPLAY_IF_EXISTS);

    if (displayIfIs) {
      node.setAttribute(DISPLAY_IF_IS, `${chain}${displayIfIs.trim()}`);
    }
    if (displayIfExists) {
      node.setAttribute(DISPLAY_IF_EXISTS, `${chain}${displayIfExists.trim()}`);
    }
  }

  __processNode(node: Element, chain: string): void {
    this.__updateDisplayConditionals(node, chain);

    if (!__isAbleToBeDisplayed(this['rootModel'], node)) {
      node.setAttribute('data-hide', 'hide');
      return;
    }

    let nodeAttributes = Array.from(node.attributes)
      .filter((attr: Attr) => attr.name.startsWith("view-model-"));

    nodeAttributes.forEach((attr: Attr) => {
      const property = attr.name.split("view-model-")[1];
      const fullChain = chain ? `${chain}${attr.value}` : attr.value;

      node.setAttribute(property, this['rootModel'].getChainValue(fullChain));
    });

    nodeAttributes = Array.from(node.attributes)
      .filter((attr: Attr) => attr.value.startsWith("@"));

    nodeAttributes.forEach((attr: Attr) => {
      const property = attr.value.split("@")[1];
      const fullChain = chain ? `${chain}${property}` : property;

      node.setAttribute(attr.name, this['rootModel'].getChainValue(fullChain));
    });

    Array.from(node.children).forEach((node: Element) => {
      this.__processNode.call(this, node, chain);
    });
  }

  prepareItem(chain: string, clonedTemplate: Element) {
    let viewModelComponents = clonedTemplate.querySelectorAll("[view-model]");

    this.__processNode.call(this, clonedTemplate, chain);

    viewModelComponents.forEach((component: HTMLElement) => {
      const fullChain: string = `${chain}${component.getAttribute('view-model')}`;
      component.setAttribute('view-model', fullChain);
    });

    return clonedTemplate;
  }

  @TableOfContentProperty({
    description: [`This property is the name of the model which will be used to generate the form. The model should be a JavaScript array.`,
      `All the information about how to write a model, hot to use the two-way binding and how to use the model with this component cand be found in the documentation found at: <psk-link page="forms/using-forms">Using forms</psk-link>`],
    isMandatory: true,
    propertyType: 'string',
    specialNote: [`If this property is not provided, nothing written inside the component's template will be displayed.`]
  })
  @Prop() dataViewModel?: string | null = null;
}
