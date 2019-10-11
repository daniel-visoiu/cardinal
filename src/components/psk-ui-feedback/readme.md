# rms-alert



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type      | Default          |
| ------------------- | --------------------- | ----------- | --------- | ---------------- |
| `message`           | `message`             |             | `any`     | `undefined`      |
| `opened`            | `opened`              |             | `boolean` | `false`          |
| `timeMeasure`       | `time-measure`        |             | `string`  | `'seconds'`      |
| `timeSinceCreation` | `time-since-creation` |             | `number`  | `undefined`      |
| `typeOfAlert`       | `type-of-alert`       |             | `string`  | `"succes-alert"` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `closeFeedback` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [psk-list-feedbacks](../psk-list-feedbacks)

### Graph
```mermaid
graph TD;
  psk-list-feedbacks --> psk-ui-feedback
  style psk-ui-feedback fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
