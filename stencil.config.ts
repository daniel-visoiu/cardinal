  import { Config } from '@stencil/core';

  export interface CardinalConfig extends Config{
    readonly useBootstrap: boolean;
  }

  export const config: CardinalConfig = {
    namespace: 'cardinal',
    outputTargets: [
      {
        type: 'dist',
        esmLoaderPath: '../loader',
        copy: [
          { src: 'controllers/AppConfigurationHelper.js', dest:"../cardinal/controllers/AppConfigurationHelper.js", warn:true },
          { src: 'controllers/base-controllers', dest:"../cardinal/controllers/base-controllers", warn:true },
          { src: 'events/*.js', dest:"../cardinal/events", warn:true }
        ]
      },
      {
        type: 'docs-readme'
      },
      {
        type: 'www',
        serviceWorker: null // disable service workers
      }
    ],
    useBootstrap:true
  };
