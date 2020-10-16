import { ComponentInterface } from '@stencil/core';

interface ComponentInheritorInterface {
  propagate?: boolean,
  permissive?: boolean
}

const DEFAULTS: {
  OPTIONS: ComponentInheritorInterface,
  PROPAGATE_PATH: string,
  [key: string]: any
} = {
  OPTIONS: { propagate: true, permissive: false },
  PROPAGATE_PATH: 'inheritor'
}

function ComponentInheritor(options: ComponentInheritorInterface = DEFAULTS.OPTIONS) {
  const params = __prepareOptions();
  const inherited = { attributes: [] };

  function __prepareOptions(): ComponentInheritorInterface {
    if (typeof options !== 'object') return DEFAULTS.OPTIONS;
    if (typeof options.propagate !== 'boolean') options.propagate = DEFAULTS.OPTIONS.propagate;
    if (typeof options.permissive !== 'boolean') options.permissive = DEFAULTS.OPTIONS.permissive;
    return options;
  }

  return (proto: ComponentInterface, instance: string): void => {
    const { componentWillLoad } = proto;

    proto.componentWillLoad = function() {
      const definitions = [];
      for (const key in this) {
        // this.hasOwnProperty(key)) must not be used!
        if (typeof this[key] === 'function' && !params.permissive) continue;
        definitions.push(key);
      }
      inherited.attributes = definitions;

      this[instance] = inherited;
      if (params.propagate) this[DEFAULTS.PROPAGATE_PATH] = inherited;

      return componentWillLoad && componentWillLoad.call(this);
    }
  }
}

export default ComponentInheritor;
