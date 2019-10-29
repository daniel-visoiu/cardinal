# psk-app-router



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type         | Default     |
| ---------------- | ------------------ | ----------- | ------------ | ----------- |
| `failRedirectTo` | `fail-redirect-to` |             | `string`     | `""`        |
| `historyType`    | `history-type`     |             | `string`     | `"browser"` |
| `menuItems`      | --                 |             | `MenuItem[]` | `[]`        |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `needMenuItems` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [app-root](../app-root)

### Depends on

- stencil-route
- [psk-ui-loader](../psk-ui-loader)
- stencil-router
- stencil-route-switch

### Graph
```mermaid
graph TD;
  psk-app-router --> stencil-route
  psk-app-router --> psk-ui-loader
  psk-app-router --> stencil-router
  psk-app-router --> stencil-route-switch
  app-root --> psk-app-router
  style psk-app-router fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
