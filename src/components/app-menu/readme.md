# app-menu-item



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type     | Default     |
| ------------------- | --------------------- | ----------- | -------- | ----------- |
| `controller`        | `controller`          |             | `any`    | `undefined` |
| `hamburgerMaxWidth` | `hamburger-max-width` |             | `number` | `600`       |
| `itemRenderer`      | `item-renderer`       |             | `string` | `undefined` |
| `menuItems`         | `menu-items`          |             | `any`    | `undefined` |
| `onMenuChanged`     | `on-menu-changed`     |             | `any`    | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `menuEvent`     |             | `CustomEvent<any>` |
| `needMenuItems` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [app-container](../app-container)

### Graph
```mermaid
graph TD;
  app-container --> app-menu
  style app-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
