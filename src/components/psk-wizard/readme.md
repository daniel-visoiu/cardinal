# psk-wizard



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type           | Default     |
| ----------------- | ------------------ | ----------- | -------------- | ----------- |
| `componentRender` | `component-render` |             | `string`       | `undefined` |
| `wizardSteps`     | --                 |             | `WizardStep[]` | `undefined` |


## Events

| Event                     | Description | Type               |
| ------------------------- | ----------- | ------------------ |
| `changeStep`              |             | `CustomEvent<any>` |
| `finishWizard`            |             | `CustomEvent<any>` |
| `needWizardConfiguration` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [psk-stepper](../psk-stepper)

### Graph
```mermaid
graph TD;
  psk-wizard --> psk-stepper
  style psk-wizard fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
