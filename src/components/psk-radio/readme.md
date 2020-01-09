# psk-radio



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type      | Default |
| -------------- | --------------- | ----------- | --------- | ------- |
| `checked`      | `checked`       |             | `boolean` | `false` |
| `invalidValue` | `invalid-value` |             | `boolean` | `null`  |
| `label`        | `label`         |             | `string`  | `null`  |
| `name`         | `name`          |             | `string`  | `null`  |
| `readOnly`     | `read-only`     |             | `boolean` | `false` |
| `value`        | `value`         |             | `string`  | `null`  |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `onChangeRadio` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [psk-radio-group](../psk-radio-group)

### Depends on

- [psk-label](../psk-label)

### Graph
```mermaid
graph TD;
  psk-radio --> psk-label
  psk-radio-group --> psk-radio
  style psk-radio fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
