import { Component, h, Prop, Element } from '@stencil/core';
import { TableOfContentProperty } from '../../decorators/TableOfContentProperty';
import CustomTheme from '../../decorators/CustomTheme';
import { BindModel } from '../../decorators/BindModel';
import PskButtonEvent from "../../events/PskButtonEvent";

@Component({
	tag: 'psk-files-chooser',
  styleUrl: "./psk-files-chooser.css"
})

export class PskFilesChooser {
  @CustomTheme()

  @BindModel() modelHandler;
  @Element() htmlElement: HTMLElement;
  @TableOfContentProperty({
    description: `This is the label of the button`,
    isMandatory: false,
    propertyType: `string`,
    defaultValue: `Select files`
  })
  @Prop() label: string = "Select files";

  @TableOfContentProperty({
    description: `This property tells the component which types of files can be uploaded from the user's device.`,
    isMandatory: false,
    propertyType: `string`,
    specialNote: `If this property is missing, then all types of files can be uploaded.`
  })
  @Prop() accept?: string;

  @TableOfContentProperty({
    description: `This property tells the component if the list of uploaded files will be visible.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: false,
    specialNote: `If this property is missing, then the list of uploaded files will be hidden.`
  })
  @Prop() listFiles?: boolean = false;

  @TableOfContentProperty({
    description: `This property tells the component if the uploaded files should be appended to the existing file list.`,
    isMandatory: false,
    propertyType: `boolean`,
    defaultValue: false,
    specialNote: `If this property is missing, then the list of uploaded files will be overridden every time the user select files again.`
  })
  @Prop() filesAppend?: boolean = false;

  @TableOfContentProperty({
    description: `This property represents the list of uploaded files.`,
    isMandatory: false,
    propertyType: `File[]`
  })
  @Prop() files: File[] = [];

  @Prop() eventName?: string;

  triggerBrowseFile(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.htmlElement.querySelector("input").click();
  }

  addedFile(event) {
    let filesArray = Array.from(event.target.files);

    if (this.modelHandler) {
      let newFiles = this.filesAppend ? [...this.files, ...filesArray] : filesArray;
      this.modelHandler.updateModel('files', newFiles);
    }

    if (this.eventName) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let pskFileChooserEvent = new PskButtonEvent(this.eventName, filesArray, {
        bubbles: true,
        composed: true,
        cancelable: true
      });
      let eventDispatcherElement = this.htmlElement;
      eventDispatcherElement.dispatchEvent(pskFileChooserEvent);

      /**
       * SPA issue: When you try to upload the same file/folder, onChange event is not triggered.
       * Solution: Reset the input after the files are emitted via dispatchEvent.
       */
      this.files = filesArray as File[];
      event.target.value = null;
    }
  }

  deleteFileFromList(data: File) {
    let files = this.files;
    if (files && this.modelHandler) {
      let currentFileIndex = files.indexOf(data);
      if (currentFileIndex > -1) {
        files.splice(currentFileIndex, 1);
        this.modelHandler.updateModel('files', files);
      }
    }
  }

  mapFileToDiv(file) {
    return <div class="fileDiv">
      <button type="button" class="btn btn-secondary trashButton"
              onClick={() => this.deleteFileFromList(file)}>
        <psk-icon icon="trash"/>
      </button>
      <p>{file.name}</p>
    </div>
  }

  render() {
    let directoryAttributes = {};
    let selectedFiles = null;

    if (this.accept === 'directory') {
      directoryAttributes = {
        directory: true,
        mozdirectory: true,
        webkitdirectory: true
      };
      this.accept = null;
    }

    if (this.listFiles) {
      selectedFiles = <div>
        {this.files.map((file) => this.mapFileToDiv(file))}
      </div>
    }

    return [
      <button type="button" class="btn btn-secondary" onClick={this.triggerBrowseFile.bind(this)}>
        <slot/>
        <label>
          {this.label}
          <input
            multiple
            {...directoryAttributes}
            accept={this.accept}
            type="file"
            onClick={(event) => {
              event.stopImmediatePropagation()
            }}
            onChange={this.addedFile.bind(this)}
            class="form-control-file form-control-sm"/>
        </label>
      </button>,
      selectedFiles,
      (!this.eventName && !this.modelHandler) ? <h5 class="mt-4">No controller set for this component!</h5> : null
    ]
  }
}
