Package.describe({
    summary: "Integration ClazzJS library (https://github.com/alexpods/ClazzJS) into meteor"
});

Package.on_use(function(api) {
    api.use('underscore', ['client', 'server']);
    api.use('deps', ['client', 'server']);

    api.add_files('lib/ClazzJS.min.js',     ['server', 'client']);
    api.add_files('lib/globals.js');

    api.add_files('lib/meta/Meteor.js', ['server', 'client']);

    api.export('clazz',     ['server', 'client']);
    api.export('namespace', ['server', 'client']);
    api.export('meta',      ['server', 'client']);
});
