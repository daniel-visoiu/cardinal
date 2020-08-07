# psk-chapter



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `title`  | `title`   |             | `string` | `undefined` |


## Dependencies

### Used by

 - [psk-controller-descriptor](../pages-components)
 - [psk-event-descriptor](../pages-components)
 - [psk-property-descriptor](../pages-components)

### Depends on

- [psk-chapter](.)

### Graph
```mermaid
graph TD;
  psk-chapter-wrapper --> psk-chapter
  psk-chapter --> psk-card
  psk-card --> psk-copy-clipboard
  psk-controller-descriptor --> psk-chapter-wrapper
  psk-event-descriptor --> psk-chapter-wrapper
  psk-property-descriptor --> psk-chapter-wrapper
  style psk-chapter-wrapper fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
