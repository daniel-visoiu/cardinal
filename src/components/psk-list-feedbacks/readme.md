# psk-list-feedbacks



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type     | Default            |
| ------------------- | --------------------- | ----------- | -------- | ------------------ |
| `hour`              | `hour`                |             | `number` | `60 * this.minute` |
| `messagesToDisplay` | `messages-to-display` |             | `number` | `3`                |
| `minute`            | `minute`              |             | `number` | `60 * this.second` |
| `second`            | `second`              |             | `number` | `1000`             |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `openFeedback` |             | `CustomEvent<any>` |
| `showFeedback` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [psk-ui-feedback](..\psk-ui-feedback)

### Graph
```mermaid
graph TD;
  psk-list-feedbacks --> psk-ui-feedback
  style psk-list-feedbacks fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
