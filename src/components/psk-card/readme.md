# psk-card



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `id`     | `id`      |             | `string` | `""`    |
| `title`  | `title`   |             | `string` | `""`    |


## Dependencies

### Used by

 - [psk-barcode-scanner](../psk-barcode/psk-barcode-scanner)
 - [psk-chapter](../psk-chapter)
 - [psk-description](../psk-description)
 - [psk-toc](../psk-toc)
 - [qr-code-generator](../psk-barcode/qr-code-generator)
 - [qr-code-reader](../psk-barcode/qr-code-reader)

### Depends on

- [psk-copy-clipboard](../psk-copy-clipboard)

### Graph
```mermaid
graph TD;
  psk-card --> psk-copy-clipboard
  psk-barcode-scanner --> psk-card
  psk-chapter --> psk-card
  psk-description --> psk-card
  psk-toc --> psk-card
  qr-code-generator --> psk-card
  qr-code-reader --> psk-card
  style psk-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
