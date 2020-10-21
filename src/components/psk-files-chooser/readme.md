# psk-files-chooser



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type      | Default          |
| ------------- | -------------- | ----------- | --------- | ---------------- |
| `accept`      | `accept`       |             | `string`  | `undefined`      |
| `eventName`   | `event-name`   |             | `string`  | `undefined`      |
| `files`       | --             |             | `any[]`   | `null`           |
| `filesAppend` | `files-append` |             | `boolean` | `false`          |
| `label`       | `label`        |             | `string`  | `"Select files"` |
| `listFiles`   | `list-files`   |             | `boolean` | `false`          |


## Dependencies

### Used by

 - [psk-barcode-scanner](../psk-barcode/psk-barcode-scanner)

### Depends on

- [psk-icon](../psk-icon)

### Graph
```mermaid
graph TD;
  psk-files-chooser --> psk-icon
  psk-barcode-scanner --> psk-files-chooser
  style psk-files-chooser fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
