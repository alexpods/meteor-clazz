meteor-clazz
============

Integration of ClazzJS library (https://github.com/alexpods/ClazzJS) into meteor

ClazzJS version: 0.5.2

This package add one new meta directive to base library - **reactive**, which makes clazz reactive.
By default reactive is `false`.

For more information look at ClazzJS github repository: https://github.com/alexpods/ClazzJS;

The following example will give you a common idea about ClazzJS.
```js
clazz("Person", function(self) {
    return {
        reactive: true,
        constants: {
            SEX: ['male', 'female'],
        },
        clazz_properties: {
            countries: {
                type: ['array', { element: ['string' , { pattern: /(\w+\s?)+/ }] }],
                default: ['russia', 'usa', 'china', 'france']
            }
        },
        properties: {
            name: {
                type: 'string',
                methods: ['get'],
                reactive: false
            },
            phone: {
                type: ['string', {
                    pattern: /\d{1,2}-\d{3}-\d{5,7}/
                }]
            },
            birthday: {
                type: 'datetime',
                constratins: {
                    inPast: function(birthday) {
                        return birthday.getTime() < Date.now();
                    }
                }
            },
            sex: {
                type: 'string',
                methods: ['get', 'set', 'is'],
                converters: {
                    toFull: function(sex) {
                        switch(sex.toLowerCase()) {
                            case 'm': sex = 'male'; break;
                            case 'f': sex = 'female'; break;
                        }
                        return sex;
                    }
                },
                constraints: {
                    existedSex: function(sex) {
                        return -1 !== this.const('SEX').indexOf(sex);
                    }
                }
            },
            address:  {
                type: 'string', 
                default: 'unknown address'
            }
        },
        clazz_methods: {
            doSomething: function() {
                console.log('clazz is doing something');
            },
            cryToAll: function(crying) {
                document.write('Crying to all: "' + crying + '"!');
                this.emit('crying', crying);
            }
        },
        methods: {
            getAge: function() {
                return (new Date()).getFullYear() - this.getBirthday().getFullYear();
            },
            doSomething: function() {
                console.log('instance is doing somethind');
            },
            say: function(saying) {
                document.write(
                    this.getName() + ': "' + saying + '"!<br>'
                );
                this.emit('saying', saying);
            }
        },
        clazz_events: {
            'crying': {
                thatCrying: function(crying) {
                    document.write(
                        'That crying: "' + crying + '"!<br>'
                    );
                }
            },
            "instance.created": {
                newObjectCreated: function(object) {
                    document.write(
                        'Person "'+object.getUID()+'" '+
                            'with name "'+object.getName()+'" '+
                            'was created!<br>'
                    );
                }
            }
        },
        events: {
            "property.set": {
                birthdayChanged: function(property, newValue, oldValue) {
                    if ('birthday' === property) {
                        document.write(
                            'Person "' + this.getUID() + '" ' +
                                'change his birthday form "' + oldValue + '" ' +
                                'to "' + newValue + '"!<br>'
                        )
                    }
                }
            },
            "property.address.remove": {
                addressRemoved: function(oldAddress) {
                    document.write(
                        'Person "' + this.getUID() + '" ' +
                            'just remove his address "' + oldAddress + '"!<br>'
                    )
                }
            },
            'saying': {
                justSaying: function(saying) {
                    document.write('Person "' + this.getUID() + '" said: "' + saying + '"!<br>');
                }
            }
        }
    }
});
```

License
-------
Copyright (c) 2013 Aleksey Podskrebyshev. Licensed under the MIT license.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/7bdb09047f9249ae4ae8a85824644b28 "githalytics.com")](http://githalytics.com/alexpods/meteor-clazz)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/alexpods/meteor-clazz/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

