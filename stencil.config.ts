import { Config } from '@stencil/core';

export const config: Config = {
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
  ]
};
