meteor-clazz
============

Integration ClazzJS library (https://github.com/alexpods/ClazzJS) into meteor

This package add one new meta directive to base library - **reactive**, which makes clazz reactive.
By default reactive is `true`.

```js
clazz('SomeClazz', 'SomeParentClazz', function(self) {
    return {
        reactive: true, // by default reactive is 'true'. So you can omit this.
        constants: {
            ...
        }
        clazz_properties: {
            ...
        },
        properties: {
            ...
        },
        clazz_methods: {
            ...
        },
        methods: {
            ...
        }
    }
})
```

ClazzJS version: 0.4.1

License
-------
Copyright (c) 2013 Aleksey Podskrebyshev. Licensed under the MIT license.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/7bdb09047f9249ae4ae8a85824644b28 "githalytics.com")](http://githalytics.com/alexpods/meteor-clazz)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/alexpods/meteor-clazz/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

