// @flow
import { Spacebars } from 'meteor/spacebars';
import { Template } from 'meteor/templating';
import ActiveRouteBlazeError from './error';

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
  return {
    isActivePath(options = {}, attributes = {}) {
      ({ attributes, options } = getHelperArguments({ attributes, options }));

      if (typeof options === 'string') {
        options = {
          path: options,
        };
      }

      options = { ...options, ...attributes };

      const { path } = options;
      let { regex } = options;

      const className = options.class || options.className || activeClassName;

      if (typeof regex === 'string' && caseSensitive) {
        regex = new RegExp(regex);
      } else if (typeof regex === 'string') {
        regex = new RegExp(regex, 'i');
      }

      if (className && typeof className !== 'string') {
        throw new ActiveRouteBlazeError('Invalid argument, className expected to be of type string.');
      } else if (regex && !(regex instanceof RegExp)) {
        throw new ActiveRouteBlazeError('Invalid argument, regex expected to be of type RegExp.');
      } else if (path && typeof path !== 'string') {
        throw new ActiveRouteBlazeError('Invalid argument, path expected to be of type string.');
      } else if (!regex && !path) {
        throw new ActiveRouteBlazeError('Invalid arguments, isActivePath expects "string", path="string" or regex=RegExp');
      }

      const isActiveRoute = activeRoute.path({ path, regex });

      return isActiveRoute ? className : false;
    },
    isActiveRoute(options = {}, attributes = {}) {
      ({ attributes, options } = getHelperArguments({ attributes, options }));
    },
    isNotActivePath(options = {}, attributes = {}) {
      ({ attributes, options } = getHelperArguments({ attributes, options }));

      if (typeof options === 'string') {
        options = {
          path: options,
        };
      }

      options = { ...options, ...attributes };

      const { regex, path } = options;

      const className = options.class || options.className || disabledClassName;

      if (className && typeof className !== 'string') {
        throw new ActiveRouteBlazeError('Invalid argument, className expected to be of type string.');
      } else if (regex && !(regex instanceof RegExp)) {
        throw new ActiveRouteBlazeError('Invalid argument, regex expected to be of type RegExp.');
      } else if (path && typeof path !== 'string') {
        throw new ActiveRouteBlazeError('Invalid argument, path expected to be of type string.');
      } else if (!regex && !path) {
        throw new ActiveRouteBlazeError('Invalid arguments, isNotActivePath expects "string", path="string" or regex=RegExp');
      }

      const isActiveRoute = activeRoute.path({ path, regex });

      return isActiveRoute ? false : className;
    },
    isNotActiveRoute(options = {}, attributes = {}) {
      ({ attributes, options } = getHelperArguments({ attributes, options }));
    },
  };
}

export function registerTemplateHelpers(options) {
  const helpers = createTemplateHelpers(options);

  Object.entries(helpers).forEach(function registerHelper([name, func]) {
    Template.registerHelper(name, func);
  });
}
