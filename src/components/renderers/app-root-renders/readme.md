# psk-default-render



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type      | Default |
| ---------------- | ----------------- | ----------- | --------- | ------- |
| `disableSidebar` | `disable-sidebar` |             | `boolean` | `false` |
| `mobileLayout`   | `mobile-layout`   |             | `boolean` | `false` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `getAppVersion` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [psk-app-menu](../../psk-app-menu)
- [psk-user-profile](../../psk-user-profile)
- [psk-app-router](../../psk-app-router)

### Graph
```mermaid
graph TD;
  psk-default-renderer --> psk-app-menu
  psk-default-renderer --> psk-user-profile
  psk-default-renderer --> psk-app-router
  psk-app-router --> stencil-route
  psk-app-router --> psk-ui-loader
  psk-app-router --> stencil-router
  psk-app-router --> stencil-route-switch
  psk-app-router --> stencil-router-redirect
  style psk-default-renderer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
