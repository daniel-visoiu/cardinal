# psk-default-render



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                  | Default     |
| ------------- | -------------- | ----------- | --------------------- | ----------- |
| `historyType` | `history-type` |             | `"browser" \| "hash"` | `undefined` |


## Dependencies

### Depends on

- [psk-user-profile](..\..\psk-user-profile)
- [app-menu](..\..\app-menu)
- [psk-app-router](..\..\psk-app-router)

### Graph
```mermaid
graph TD;
  psk-default-renderer --> psk-user-profile
  psk-default-renderer --> app-menu
  psk-default-renderer --> psk-app-router
  psk-app-router --> stencil-route
  psk-app-router --> psk-ui-loader
  psk-app-router --> stencil-router
  psk-app-router --> stencil-route-switch
  style psk-default-renderer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
