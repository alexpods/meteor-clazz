meta('/Meteor/Meteor', {
    process: function(clazz, metaData) {
        var that = this;

        if (!Meteor.isClient) {
            return;
        }

        clazz.___isReactive  = 'reactive' in metaData
            ? metaData.reactive
            :  clazz.__collectAllPropertyValue('___isReactive');

        var containers = [
            [clazz,           metaData.clazz_properties || {}],
            [clazz.prototype, metaData.properties       || {}]
        ];


        _.each(containers, function(container) {

            var object     = container[0];
            var properties = container[1];

            if (!object.__isInterfaceImplemented('meteor')) {
                object.__implementInterface('meteor', that.interface);
            }

            object.___reactiveProperties = {};

            _.each(properties, function(params, property) {
                object.___reactiveProperties[property] = 'reactive' in params ? params.reactive : true;
            });
        });
    },

    interface: {

        __initDeps: function() {
            if (this.__isReactive()) {
                this.__createDeps();
            }
        },

        __createDeps: function() {
            var that = this;

            if (!this.__isReactive()) {
                throw new Error('Clazz "' + this.__isClazz ? this.__name : this.__clazz.__name + '" does not reactive!')
            }

            this.___deps = {};

            var properties = that.__getReactiveProperties();

            for (var i = 0, ii = properties.length; i < ii; ++i) {
                that.___deps[properties[i]] = new Deps.Dependency();
            }

            that.__addEventListener('property.get',         'depsDepend',       depsDepend)
                .__addEventListener('property.has',         'depsDepend',       depsDepend)
                .__addEventListener('property.is',          'depsDepend',       depsDepend)
                .__addEventListener('property.set',         'depsInvalidate',   depsInvalidate)
                .__addEventListener('property.remove',      'depsInvalidate',   depsInvalidate)
                .__addEventListener('property.clear',       'depsInvalidate',   depsInvalidate)

            function depsDepend(property) {
                if (!that.__isReactiveProperty(property)) {
                    return;
                }
                that.___deps[property.split('.')[0]].depend();
            }

            function depsInvalidate(property) {
                if (!that.__isReactiveProperty(property)) {
                    return;
                }
                that.___deps[property.split('.')[0]].changed();
            }
        },

        __isReactive: function() {
            return this.__isClazz ? this.___isReactive : this.__clazz.___isReactive;
        },

        __isReactiveProperty: function(property) {
            property = property.split('.')[0];
            return -1 !== this.__getReactiveProperties().indexOf(property);
        },

        __getReactiveProperties: function() {

            var properties = this.__collectAllPropertyValues('___reactiveProperties');
            var propertiesList = [];

            _.each(properties, function(value, property) {
                if (value) {
                    propertiesList.push(property);
                }
            });

            return propertiesList;
        },

        __getView: function() {
            var name, method;

            var view = {};

            for (name in this) {
                if (!_.isFunction(this[name])) {
                    continue;
                }

                method = this[name];

                var underscore = '';

                name = name.replace(/^(_+)/g, function(str, $1) {
                    underscore = $1;
                    return '';
                });

                if ((/^get[A-Z]/).test(name)) {
                    name = name.slice(3);
                    name = name[0].toLowerCase() + name.slice(1);
                }
                else if (!(/^is[A-Z]/).test(name) && !(/^has[A-Z]/).test(name)) {
                    continue;
                }

                view[underscore + name] = this.__createViewMethod(method);
            }

            return view;
        },

        __createViewMethod: function(method) {

            if (_.isString(method)) {
                method = this[method];
            }

            if (!_.isFunction(method)) {
                throw new Error('Method must be a function!');
            }

            var that = this;

            return function() {

                var params = _.toArray(arguments);
                params.pop();

                return that.__processData(method.apply(that, params), { __getView: [] });
            }
        }
    }
});