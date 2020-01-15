# psk-form



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type     | Default            |
| ---------------- | ----------------- | ----------- | -------- | ------------------ |
| `action`         | `action`          |             | `string` | `null`             |
| `controllerName` | `controller-name` |             | `string` | `"FormController"` |
| `formActions`    | `form-actions`    |             | `string` | `'submit'`         |
| `method`         | `method`          |             | `string` | `'get'`            |


## Dependencies

### Depends on

- [psk-container](../../psk-container)
- [psk-button](../../psk-button)

### Graph
```mermaid
graph TD;
  psk-form --> psk-container
  psk-form --> psk-button
  psk-container --> psk-page-loader
  style psk-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
