# psk-chapter



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `guid`   | `guid`    |             | `string` | `undefined` |
| `title`  | `title`   |             | `string` | `""`        |


## Events

| Event              | Description | Type               |
| ------------------ | ----------- | ------------------ |
| `psk-send-chapter` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [psk-code](..\psk-code)
 - [psk-controller-descriptor](..\pages-components)
 - [psk-description](..\psk-description)
 - [psk-event-descriptor](..\pages-components)
 - [psk-example](..\psk-example)
 - [psk-hoc](..\pages-components)
 - [psk-property-descriptor](..\pages-components)

### Depends on

- [psk-card](..\psk-card)

### Graph
```mermaid
graph TD;
  psk-chapter --> psk-card
  psk-card --> psk-grid
  psk-card --> psk-copy-clipboard
  psk-code --> psk-chapter
  psk-controller-descriptor --> psk-chapter
  psk-description --> psk-chapter
  psk-event-descriptor --> psk-chapter
  psk-example --> psk-chapter
  psk-hoc --> psk-chapter
  psk-property-descriptor --> psk-chapter
  style psk-chapter fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
