# app-root



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description | Type            | Default     |
| ------------ | ------------ | ----------- | --------------- | ----------- |
| `controller` | `controller` |             | `any`           | `undefined` |
| `history`    | --           |             | `RouterHistory` | `undefined` |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `routeChanged` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [psk-user-profile](../psk-user-profile)
- [app-menu](../app-menu)
- [psk-app-router](../psk-app-router)

### Graph
```mermaid
graph TD;
  app-root --> psk-user-profile
  app-root --> app-menu
  app-root --> psk-app-router
  psk-app-router --> stencil-route
  psk-app-router --> psk-ui-loader
  psk-app-router --> stencil-router
  psk-app-router --> stencil-route-switch
  style app-root fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
