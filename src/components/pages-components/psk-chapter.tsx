import {Component, h, Prop, Event, EventEmitter, Listen, getElement, State} from "@stencil/core";

@Component({
  tag: "psk-chapter",
  styleUrl: "./page.css"
})

export class PskChapter {

  @State() chapterInfo;
  @Prop() title: string;
  @State() guid: string;
  @Event({
    eventName: "psk-send-chapter",
    bubbles: true,
    composed: false,
    cancelable: true
  }) sendChapter: EventEmitter;
  @State() reportedToc = false;


  @Listen("psk-send-chapter")
  receivedChapter(event: any) {

    if (event.path && event.path[0] && getElement(this) !== event.path[0]) {
      event.stopImmediatePropagation();

      if (this.chapterInfo.children.length > 0) {
        let isExistingChild = false;
        this.chapterInfo.children.forEach((child) => {
          if (child.guid === event.detail.guid) {
            child.children = event.detail.children;
            isExistingChild = true;
          }
        });
        if(!isExistingChild){
          this.chapterInfo.children.push(event.detail);
        }
      } else {
        this.chapterInfo.children.push(event.detail);
      }

      this.sendChapter.emit(this.chapterInfo);
      this.reportedToc = true;
    }
  }

  constructor() {
    let _uuidv4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    this.chapterInfo = {
      data: this.title,
      guid: _uuidv4(),
      children: []
    }
  }

  componentDidLoad() {
    if (!this.reportedToc) {
      this.sendChapter.emit(this.chapterInfo)
    }
  }

  render() {
    return (
      [<div>{this.title}</div>,
        <slot/>]
    )
  }

}
