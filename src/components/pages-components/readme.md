# psk-page



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `title`  | `title`   |             | `string` | `""`    |


## Dependencies

### Depends on

- [psk-hoc]()
- [psk-chapter](..\psk-chapter)

### Graph
```mermaid
graph TD;
  psk-property-descriptor --> psk-hoc
  psk-property-descriptor --> psk-chapter
  psk-hoc --> psk-chapter
  psk-chapter --> psk-card
  psk-card --> psk-grid
  psk-card --> psk-copy-clipboard
  style psk-property-descriptor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
