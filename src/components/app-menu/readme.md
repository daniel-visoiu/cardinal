# app-menu-item



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type         | Default     |
| ------------------- | --------------------- | ----------- | ------------ | ----------- |
| `hamburgerMaxWidth` | `hamburger-max-width` |             | `number`     | `600`       |
| `itemRenderer`      | `item-renderer`       |             | `string`     | `undefined` |
| `menuItems`         | --                    |             | `MenuItem[]` | `null`      |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `menuEvent`     |             | `CustomEvent<any>` |
| `needMenuItems` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [app-container](..\app-container)
 - [psk-default-renderer](..\renderers\app-root-renders)

### Graph
```mermaid
graph TD;
  app-container --> app-menu
  psk-default-renderer --> app-menu
  style app-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
