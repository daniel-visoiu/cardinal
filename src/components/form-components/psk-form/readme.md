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

- [psk-button](../../psk-button)
- [psk-container](../../psk-container)

### Graph
```mermaid
graph TD;
  psk-form --> psk-button
  psk-form --> psk-container
  psk-container --> psk-page-loader
  style psk-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
