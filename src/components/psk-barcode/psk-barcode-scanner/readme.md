# psk-barcode-scanner



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type      | Default     |
| ------------------- | --------------------- | ----------- | --------- | ----------- |
| `allowFileBrowsing` | `allow-file-browsing` |             | `boolean` | `false`     |
| `data`              | `data`                |             | `any`     | `undefined` |
| `normalSize`        | `normal-size`         |             | `boolean` | `false`     |
| `title`             | `title`               |             | `string`  | `""`        |


## Dependencies

### Depends on

- [psk-card](../../psk-card)
- [psk-highlight](../../psk-highlight)
- [psk-files-chooser](../../psk-files-chooser)
- [psk-button](../../psk-button)

### Graph
```mermaid
graph TD;
  psk-barcode-scanner --> psk-card
  psk-barcode-scanner --> psk-highlight
  psk-barcode-scanner --> psk-files-chooser
  psk-barcode-scanner --> psk-button
  psk-card --> psk-copy-clipboard
  style psk-barcode-scanner fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
