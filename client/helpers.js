// @flow
import { Spacebars } from 'meteor/spacebars';
import { Template } from 'meteor/templating';
import ActiveRouteBlazeError from './error';

function addHelper(helpers, helper) {
  return { ...helpers, ...helper };
}

function createHelper([helperName, { activeRoute, caseSensitive, className, inverse, type }]) {
  return {
    [helperName](options = {}, attributes = {}) {
      if (options instanceof Spacebars.kw) {
        options = options.hash;
      }

      if (attributes instanceof Spacebars.kw) {
        attributes = attributes.hash;
      }

      if (typeof options === 'string') {
        options = {
          [type]: options,
        };
      }

      options = { ...options, ...attributes };

      let { regex } = options;
      const value = options[type];

      className = options.class || options.className || className;

      if (typeof regex === 'string' && caseSensitive) {
        regex = new RegExp(regex);
      } else if (typeof regex === 'string') {
        regex = new RegExp(regex, 'i');
      }

      if (className && typeof className !== 'string') {
        const classAttribute = options.class ? 'class' : 'className';
        throw new ActiveRouteBlazeError(`Invalid argument, ${classAttribute} expected to be of type string.`);
      } else if (regex && !(regex instanceof RegExp)) {
        throw new ActiveRouteBlazeError('Invalid argument, regex expected to be of type RegExp.');
      } else if (value && typeof value !== 'string') {
        throw new ActiveRouteBlazeError(`Invalid argument, ${type} expected to be of type string.`);
      } else if (!value && !regex) {
        throw new ActiveRouteBlazeError(`Invalid arguments, ${helperName} expects "string", ${type}="string", regex="string" or regex=/regex/`);
      }

      const {
        class: _c,
        className: _cn,
        data: _d,
        regex: _r,
        name: _n,
        path: _p,
        ...params
      } = {
        ...attributes.data,
        ...attributes,
      };

      let result = activeRoute[type]({
        params,
        regex,
        [type]: value,
      });

      if (inverse) {
        result = !result;
      }

      return result ? className : false;
    },
  };
}

function getHelperArguments({ attributes, options }) {
  if (options instanceof Spacebars.kw) {
    options = options.hash;
  }

  if (attributes instanceof Spacebars.kw) {
    attributes = attributes.hash;
  }

  return { attributes, options };
}

export function createTemplateHelpers({
  activeClassName = 'active',
  activeRoute,
  caseSensitive = false,
  disabledClassName = 'disabled',
}) {
  let helperOptions = {
    activeRoute,
    caseSensitive,
  };

  helperOptions = {
    isActivePath: {
      ...helperOptions,
      className: activeClassName,
      inverse: false,
      type: 'path',
    },
    isActiveRoute: {
      ...helperOptions,
      className: activeClassName,
      inverse: false,
      type: 'name',
    },
    isNotActivePath: {
      ...helperOptions,
      className: disabledClassName,
      inverse: true,
      type: 'path',
    },
    isNotActiveRoute: {
      ...helperOptions,
      className: disabledClassName,
      inverse: true,
      type: 'name',
    },
  };

  return Object.entries(helperOptions).map(createHelper).reduce(addHelper, {});
}

export function registerTemplateHelpers(options) {
  const helpers = createTemplateHelpers(options);

  Object.entries(helpers).forEach(function registerHelper([name, func]) {
    Template.registerHelper(name, func);
  });
}
