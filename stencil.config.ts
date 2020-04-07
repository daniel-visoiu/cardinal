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
          { src: 'controllers/AppControllerUtils.js', dest:"../cardinal/utils/AppControllerUtils.js", warn:true }
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
