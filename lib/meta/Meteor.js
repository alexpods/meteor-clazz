meta('/Meteor/Meteor', {
    process: function(clazz, metaData) {
        var isReactive = 'reactive' in metaData ? metaData.reactive :  true;

        if (!Meteor.isClient || !isReactive) {
            return;
        }

        if (!clazz.__isInterfaceImplemented('meteor')) {
            clazz.__implementInterface('meteor', this.interface);
        }

        if (!clazz.prototype.__isInterfaceImplemented('meteor')) {
            clazz.prototype.__implementInterface('meteor', this.interface);
        }

        clazz.__initMeteor();
    },

    interface: {

        __initMeteor: function() {
            this.__deps = {};
            this.__createDeps();
        },

        __createDeps: function() {
            var properties = this.__getPropertiesParam();

            for (var property in properties) {
                this.__createPropertyDeps(property);
            }
        },

        __createPropertyDeps: function(property) {
            this.__deps[property] = new Deps.Dependency();

            this.__addGetter(property, 'depsDepend', function(value) {
                this.__deps[property].depend();
                return value;
            });

            if (!this.__hasEventListener('property.' + property + '.changed', 'depsInvalidate')) {

                this.__addEventListener('property.' + property + '.setted', 'depsInvalidate', function() {
                    this.__changeDeps(this, property);
                });

                this.__addEventListener('property.' + property + '.changed', 'depsInvalidate', function() {
                    this.__changeDeps(this, property);
                });
            }

            var count = 0;

            function changeDeps(object, property) {
                if (!Deps.active) {
                    count = 0;
                }

                if (count < 1) {
                    object.__deps[property].changed();
                    ++count;
                }
            }
        }
    }
});