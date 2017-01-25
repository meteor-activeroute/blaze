# activeroute:blaze

Blaze helpers for activeroute:core.

## Install

```sh
meteor add activeroute:blaze
```

# Usage

```js
import { Template } from 'meteor/templating';
import { createTemplateHelpers, registerTemplateHelpers } from 'meteor/activeroute:blaze';
import ActiveRoute from 'meteor/activeroute:core';
import adapter from 'meteor/activeroute:iron-router';

const activeRoute = new ActiveRoute({
  routerAdapter: adapter,
});

// Create and register template helpers automatically
registerTemplateHelpers({
  activeClassName: 'active', // Default value
  activeRoute,
  caseSensitive: false, // Default value
  disabledClassName: 'disabled', // Default value
});

// Create and register template helpers manually.
// This would allow you to only register one or more
// helpers on specific templates or globally.
const templateHelpers = createTemplateHelpers({
  activeClassName: 'active', // Default value
  activeRoute,
  caseSensitive: false, // Default value
  disabledClassName: 'disabled', // Default value
});

// Register each helper in templateHelpers
Object.entries(templateHelpers).forEach(function registerHelper([name, func]) {
  Template.registerHelper(name, func);
});
```
