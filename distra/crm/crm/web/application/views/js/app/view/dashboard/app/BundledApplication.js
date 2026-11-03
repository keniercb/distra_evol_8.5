Ext.app.Controller.strings.module = {
    getter: 'getModule',
    upper: 'Module'
};

Ext.define('Ext.app.BundledApplication', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.tip.QuickTipManager'
    ],

    /**
     * @cfg {String} name
     * The name of your application. This will also be the namespace for your views, controllers
     * models and stores. Don't use spaces or special characters in the name. **Application name
     * is mandatory**.
     */

    /**
     * @cfg {String/String[]} controllers
     * Names of controllers that the app uses.
     */

    /**
     * @cfg {Object} scope
     * The scope to execute the {@link #launch} function in. Defaults to the Application instance.
     */
    scope: undefined,

    /**
     * @cfg {Boolean} enableQuickTips
     * True to automatically set up Ext.tip.QuickTip support.
     */
    enableQuickTips: true,

    /**
     * @cfg {String} appFolder
     * The path to the directory which contains all application's classes.
     * This path will be registered via {@link Ext.Loader#setPath} for the namespace specified
     * in the {@link #name name} config.
     */
    appFolder: 'app',
    depth: 0,
    isModule: false,
    viewEvents:[],
    /**
     * @cfg {Boolean} autoConfig
     * Specify if the application's module contain a config file definition.
     */
    autoConfig: false,
    /**
     * @cfg {String} language
     * Specify the application's language definition.
     */
    language: null,
    // NOTE - this config has to be processed by Ext.application

    /**
     * @cfg {String} appProperty
     * The name of a property to be assigned to the main namespace to gain a reference to
     * this application. Can be set to an empty value to prevent the reference from
     * being created
     *
     *     Ext.application({
     *         name: 'MyApp',
     *         appProperty: 'myProp',
     *
     *         launch: function() {
     *             console.log(MyApp.myProp === this);
     *         }
     *     });
     */
    appProperty: 'app',

    /**
     * @cfg {String/String[]} [namespaces]
     *
     * The list of namespace prefixes used in the application to resolve dependencies
     * like Views and Stores:
     *
     *      Ext.application({
     *          name: 'MyApp',
     *
     *          namespaces: ['Common.code'],
     *
     *          controllers: [ 'Common.code.controller.Foo', 'Bar' ]
     *      });
     *
     *      Ext.define('Common.code.controller.Foo', {
     *          extend: 'Ext.app.Controller',
     *
     *          models: ['Foo'],    // Loads Common.code.model.Foo
     *          views:  ['Bar']     // Loads Common.code.view.Bar
     *      });
     *
     *      Ext.define('MyApp.controller.Bar', {
     *          extend: 'Ext.app.Controller',
     *
     *          models: ['Foo'],    // Loads MyApp.model.Foo
     *          views:  ['Bar']     // Loads MyApp.view.Bar
     *      });
     *
     * You don't need to include main namespace (MyApp), it will be added to the list
     * automatically.
     */
    namespaces: [],

    /**
     * @cfg {Boolean} [autoCreateViewport=false]
     * True to automatically load and instantiate AppName.view.Viewport before firing the launch
     * function.
     */
    autoCreateViewport: false,

    /**
     * @cfg {Object} paths
     * Additional load paths to add to Ext.Loader.
     * See {@link Ext.Loader#paths} config for more details.
     */
    paths: null,

    onClassExtended: function (cls, data, hooks) {
        var Controller = Ext.app.Controller,
            proto = cls.prototype,
            requires = [],
            onBeforeClassCreated, paths, namespace, ns, appFolder;

        var isApplication = cls.$className.split('.').pop() === '$application';

        //if name is not provided, then assign "short" $className as name.
        namespace = data.name || (!isApplication && cls.$className.split('.').pop());
        //re-assign name property
        data.name = namespace;
        //data.isApplication = isApplication;
        data.isModule = !isApplication;

        if (!isApplication) {
            var fullPath = Ext.Loader.getPath(cls.$className);
            var name = cls.$className.split('.').pop();
            var path = fullPath.replace(name + '.js', '');
            appFolder = path + (data.appFolder || data.name || name);
        } else {
            appFolder = data.appFolder || cls.superclass.appFolder;
        }

        if (namespace) {
            data.$namespace = namespace;
            Ext.app.addNamespaces(namespace);
        }

        if (data.namespaces) {
            Ext.app.addNamespaces(data.namespaces);
        }

        if (!data['paths processed']) {
            if (namespace && appFolder) {
                Ext.Loader.setPath(namespace, appFolder);
            }

            paths = data.paths;

            if (paths) {
                for (ns in paths) {
                    if (paths.hasOwnProperty(ns)) {
                        Ext.Loader.setPath(ns, paths[ns]);
                    }
                }
            }
        }
        else {
            delete data['paths processed'];
        }

        if (data.autoCreateViewport) {
            //<debug>
            if (!namespace) {
                Ext.Error.raise(["[Ext.app.Application] Can't resolve namespace for",
                    data.$className,
                    ", did you forget to specify 'name' property?"].join(' ')
                );
            }
            //</debug>

            Controller.processDependencies(proto, requires, namespace, 'view', ['Viewport']);
        }

        //Load modules
        Controller.processDependencies(proto, requires, namespace, 'module', data.modules);

        // Any "requires" also have to be processed before we fire up the App instance.
        if (requires.length) {
            onBeforeClassCreated = hooks.onBeforeCreated;

            hooks.onBeforeCreated = function (cls, data) {
                var args = Ext.Array.clone(arguments);

                Ext.require(requires, function () {
                    return onBeforeClassCreated.apply(this, args);
                });
            };
        }
    },

    /**
     * Creates new Application.
     * @param {Object} [config] Config object.
     */
    constructor: function (config) {
        var me = this;

        //<debug>
        if (Ext.isEmpty(me.name)) {
            Ext.Error.raise("[Ext.app.Application] Name property is required");
        }
        //</debug>

        me.callParent(arguments);

        me.doInit(me);

        me.initNamespace();
        me.initModules();
        me.initControllers();
        me.onBeforeLaunch();

        me.finishInitControllers();
    },

    doInit: function (app) {
        var me = this;
        if (me.autoConfig) {
            Ext.require(me.name + '.config', function () {
                me.config = Ext.create(me.name + '.config');
            });
        }

        if (!!me.language) {
            var namespace = this.$namespace || this.$className.split('.')[0];
            var langCode = (Ext.isString(me.language) && me.language.toLowerCase()) || 'es';
            var className = Ext.app.Controller.getFullName(langCode, 'language', namespace).absoluteName;
            Ext.require(className, function () {
                me.$lang = me.language = Ext.create(className);
            });
        }

        me.callParent(arguments);
    },

    initNamespace: function () {
        var me = this,
            appProperty = me.appProperty,
            ns;

        ns = Ext.namespace(me.name);

        if (ns) {
            ns.getApplication = function () {
                return me;
            };

            if (appProperty) {
                if (!ns[appProperty]) {
                    ns[appProperty] = me;
                }
                //<debug>
                else if (ns[appProperty] !== me) {
                    Ext.log.warn('An existing reference is being overwritten for ' + name + '.' + appProperty +
                        '. See the appProperty config.'
                    );
                }
                //</debug>
            }
        }
    },

    initModules: function () {
        var i, me = this,
            modules = Ext.Array.from(this.modules);

        me.modules = new Ext.util.MixedCollection();
        for (i = 0; i < modules.length; i++) {
            me.getModule((me.name || me.id) + '.module.' + modules[i]);
        }
    },

    initControllers: function () {
        var me = this,
            controllers = Ext.Array.from(me.controllers);

        me.controllers = new Ext.util.MixedCollection();

        for (var i = 0, ln = controllers.length; i < ln; i++) {
            me.getController(controllers[i]);
        }
    },

    finishInitControllers: function () {
        var me = this,
            controllers, i, l;

        controllers = me.controllers.getRange();

        for (i = 0, l = controllers.length; i < l; i++) {
            controllers[i].finishInit(me);
        }
    },

    /**
     * @method
     * @template
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load.
     * @param {String} profile The detected application profile
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch: Ext.emptyFn,

    /**
     * @private
     */
    onBeforeLaunch: function () {
        var me = this,
            controllers, c, cLen, controller;

        if (me.enableQuickTips) {
            me.initQuickTips();
        }

        if (me.autoCreateViewport && !me.application) {
            me.initViewport();
        } else {
            me.initMainView();
        }

        me.launch.call(me.scope || me);
        me.launched = true;
        me.fireEvent('launch', me);

        controllers = me.controllers.items;
        cLen = controllers.length;

        for (c = 0; c < cLen; c++) {
            controller = controllers[c];
            controller.onLaunch(me);
        }
    },

    getModuleClassName: function (name, kind) {
        return Ext.app.Controller.getFullName(name, kind, this.name).absoluteName;
    },

    initQuickTips: function () {
        Ext.tip.QuickTipManager.init();
    },

    initViewport: function () {
        var me = this, viewport = this.getView('Viewport');
        if (viewport) {
            viewport.create({
                listeners: {
                    afterrender: function () {
                        for (var index in me.viewEvents) {
                            var eventName = me.viewEvents[index].toLowerCase();
                            me.fireEvent(eventName);
                        }
                        return true;
                    }
                }
            });
        }
    },

    initMainView: function (view) {
        var me = this;
        var nameView = view || 'Main', listener = {};
        if (me.placeholder) {

            Ext.isString(me.placeholder) && (me.placeholder = {
                selector: me.placeholder
            });

            listener[me.name] = function () {
                var selects = Ext.ComponentQuery.query(me.placeholder.selector);
                if (selects.length > 0) {
                    var container = selects[0];
                    if (Ext.Loader.numPendingFiles > 0) {
                        Ext.Loader.onReady(function () {
                            me.viewInjection(nameView, container, me);
                        });
                    } else {
                        me.viewInjection(nameView, container, me);
                    }
                } else {
                    throw ['There is not component that matches with:', me.placeholder.selector, 'selector!'].join(' ');
                }
            };

            if (me.isModule && me.rootApplication.getView('Viewport')) {
                me.rootApplication.viewEvents.push(me.name);
                me.rootApplication.on(listener);
            } else {
                (listener[me.name])();
            }
        } else {
            Ext.log.warn(['A placeholder is needed in order to render', me.name, "'s view."].join(' '));
        }
    },

    viewInjection: function (name, container, scope, options) {
        var _scope = scope || this;

        var view = _scope.getView(name), instance;
        _scope.fireEvent('shellBeforeLaunch', _scope);
        if (!view) {
            Ext.log.warn(['Module', _scope.name, 'not define ', name, 'view'].join(' '));
        } else {
            options = Ext.apply((options || {}), {
                '$lang': _scope.$lang,
                'config': _scope.config
            });
            view.create = Ext.Function.createInterceptor(view.create, function () {
                var requires = this.prototype.requires;
                if (requires) {
                    for (var i = 0; i < requires.length; i++) {
                        //Ext.pass(requires[i].prototype.initComponent, []);
                        Ext.Function.interceptBefore(requires[i].prototype, 'initComponent', function () {
                            Ext.apply(this, options);
                        });
                    }
                }
                return true;
            });
            instance = view.create(options);
            container.add(instance);
            _scope.fireEvent('shellLaunch', instance, _scope);
        }

        return instance;
    },

    render: function (placeholder, view, options) {
        var me = this;
        if (!placeholder) {
            me.initMainView(view || false);
            return;
        }
        var nameView = view || 'Main', instance,
            selects = Ext.ComponentQuery.query(placeholder);

        if (selects.length == 0) {
            throw 'There is not component that matches with: ' + placeholder + ' selector!';
        }

        return me.viewInjection(nameView, selects[0], me, options);
    },

    getController: function (name) {
        var me = this,
            controllers = me.controllers,
            className, controller;

        controller = controllers.get(name);

        if (!controller) {
            className = me.getModuleClassName(name, 'controller');

            controller = Ext.create(className, {
                application: me,
                id: name
            });

            controllers.add(controller);

            if (me._initialized) {
                controller.doInit(me);
            }
        }

        return controller;
    },

    getModule: function (name) {
        var me = this, className, _app,
            depth = 1, module, result=true;
        if (!me.modules.get) {
            return true;
        }

        module = me.modules.get(name);
        if (!module) {
            className = me.getModuleClassName(name, 'module');
            _app = me;
            while (_app.hasOwnProperty('application')) {
                _app = _app.application;
                depth++;
            }
            result = _app.fireEvent('beforeloadModule', name, depth, me);
            if(result) {
                module = Ext.create(className, {
                    application: me,
                    rootApplication: _app,
                    depth: depth,
                    id: name,
                    moduleClassName: name
                });
                me.modules.add(module);
            }
        }
        return module;
    },

    getApplication: function () {
        return this;
    }
});

Ext.HMVCApplication = function (config) {
    var App, paths, ns;

    if (typeof config === "string") {
        Ext.require(config, function () {
            App = Ext.ClassManager.get(config);
        });
    } else {
        // We have to process `paths` before creating Application class,
        // or `requires` won't work.
        Ext.Loader.setPath(config.name, config.appFolder || 'app');

        if (paths = config.paths) {
            for (ns in paths) {
                if (paths.hasOwnProperty(ns)) {
                    Ext.Loader.setPath(ns, paths[ns]);
                }
            }
        }

        config['paths processed'] = true;

        // Let Ext.define do the hard work but don't assign a class name.
        //
        Ext.define(config.name + ".$application", Ext.apply({
                extend: 'Ext.app.BundledApplication' // can be replaced by config!
            }, config),
            // call here when the App class gets full defined
            function () {
                App = this;
            });
    }

    Ext.onReady(function () {
        Ext.app.Application.instance = new App();
    });
};