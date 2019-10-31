# app-root



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                  | Default     |
| ------------- | -------------- | ----------- | --------------------- | ----------- |
| `controller`  | `controller`   |             | `any`                 | `undefined` |
| `historyType` | `history-type` |             | `"browser" \| "hash"` | `undefined` |


## Events

| Event                      | Description | Type               |
| -------------------------- | ----------- | ------------------ |
| `ControllerFactoryIsReady` |             | `CustomEvent<any>` |
| `routeChanged`             |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [psk-user-profile](../psk-user-profile)
- [app-menu](../app-menu)
- [psk-app-router](../psk-app-router)

### Graph
```mermaid
graph TD;
  psk-app-root --> psk-user-profile
  psk-app-root --> app-menu
  psk-app-root --> psk-app-router
  psk-app-router --> stencil-route
  psk-app-router --> psk-ui-loader
  psk-app-router --> stencil-router
  psk-app-router --> stencil-route-switch
  style psk-app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
