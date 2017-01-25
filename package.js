Package.describe({
  documentation: 'README.md',
  git: 'git+https://github.com/meteor-activeroute/blaze.git',
  name: 'activeroute:blaze',
  summary: 'Blaze helper for activeroute:core',
  version: '1.0.0-alpha.1',
});

Package.onUse(function onUse(api) {
  api.versionsFrom('1.4.2.2');

  api.use([
    'ecmascript',
    'templating',
  ]);

  api.mainModule('client/helpers.js', 'client', { lazy: true });
});
