# psk-app-router



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                             | Default     |
| ------------- | -------------- | ----------- | -------------------------------- | ----------- |
| `historyType` | `history-type` |             | `"browser" \| "hash" \| "query"` | `undefined` |
| `routesItems` | --             |             | `MenuItem[]`                     | `[]`        |


## Events

| Event                  | Description | Type               |
| ---------------------- | ----------- | ------------------ |
| `getCustomLandingPage` |             | `CustomEvent<any>` |
| `getHistoryType`       |             | `CustomEvent<any>` |
| `needRoutes`           |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [psk-default-renderer](../renderers/app-root-renders)

### Depends on

- stencil-route
- [psk-ui-loader](../psk-ui-loader)
- stencil-router
- stencil-route-switch
- stencil-router-redirect

### Graph
```mermaid
graph TD;
  psk-app-router --> stencil-route
  psk-app-router --> psk-ui-loader
  psk-app-router --> stencil-router
  psk-app-router --> stencil-route-switch
  psk-app-router --> stencil-router-redirect
  psk-default-renderer --> psk-app-router
  style psk-app-router fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
