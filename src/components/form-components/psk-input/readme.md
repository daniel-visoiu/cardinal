# psk-input



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                                                               | Type      | Default     |
| ---------------- | ------------------ | ------------------------------------------------------------------------- | --------- | ----------- |
| `dataDate`       | `data-date`        |                                                                           | `string`  | `undefined` |
| `dataDateFormat` | `data-date-format` |                                                                           | `string`  | `null`      |
| `invalidValue`   | `invalid-value`    |                                                                           | `boolean` | `null`      |
| `label`          | `label`            |                                                                           | `string`  | `null`      |
| `name`           | `name`             |                                                                           | `string`  | `null`      |
| `placeholder`    | `placeholder`      |                                                                           | `string`  | `null`      |
| `readOnly`       | `read-only`        |                                                                           | `boolean` | `false`     |
| `required`       | `required`         |                                                                           | `boolean` | `false`     |
| `specificProps`  | `specific-props`   | Property used only by other components psk-text-input, psk-email-input... | `any`     | `{}`        |
| `type`           | `type`             |                                                                           | `string`  | `'text'`    |
| `value`          | `value`            |                                                                           | `string`  | `null`      |


## Dependencies

### Used by

 - [psk-date-input](../psk-date-input)
 - [psk-email-input](../psk-email-input)
 - [psk-icon-chooser](../../psk-icon-chooser)
 - [psk-number-input](../psk-number-input)
 - [psk-password-input](../psk-password-input)
 - [psk-text-input](../psk-text-input)

### Depends on

- [psk-label](../psk-label)

### Graph
```mermaid
graph TD;
  psk-input --> psk-label
  psk-date-input --> psk-input
  psk-email-input --> psk-input
  psk-icon-chooser --> psk-input
  psk-number-input --> psk-input
  psk-password-input --> psk-input
  psk-text-input --> psk-input
  style psk-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
