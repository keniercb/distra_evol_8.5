Ext.app.Controller.strings.module = {
    getter: 'getModule',
    upper: 'Module'
};

Ext.app.Controller.strings.language = {
    getter: 'getLanguage',
    upper: 'Language'
};

Ext.define('Ext.app.BundledApplication', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.tip.QuickTipManager',
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

    autoLoadLang: false,
    standalone: false,
    disabled: false,
    autoLoadControllers: true,

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
                Ext.Error.raise("[Ext.app.Application] Can't resolve namespace for " +
                data.$className + ", did you forget to specify 'name' property?");
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

        if (me.autoLoadLang) {
            me.initLanguage();
        }

        if(me.autoLoadControllers){
            me.initControllers();
        }

        me.initModules(); //esto debe hacerse despues de

        me.onBeforeLaunch();

        if(me.autoLoadControllers){
            me.finishInitControllers();
        }

        //registrando el modulo en el ModuleManager
        if (me.isModule) {
            ModuleMgr.register(me, me.$namespace)
        }
        //console.log(me)
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
        Ext.globalEvents.addEvents('beforeloadmodule');
        for (i = 0; i < modules.length; i++) {
            if(Ext.globalEvents.fireEvent('beforeloadmodule', modules[i], me) !== false){
                me.getModule((me.name || me.id) + '.module.' + modules[i]);
            }
        }
    },

    initLanguage: function () {
        //if (this.isModule) {
        //    var lang = LangMgr.loadLanguage(this.$namespace);
        //    this.language = lang;
        //
        //
        //    ////this.language = Ext.create((this.name || this.id) + '.languages.' + (perfil.idioma.toUpperCase() || 'ES'));
        //    //var absoluteName = Ext.app.Controller.getFullName((perfil.idioma.toUpperCase() || 'ES'), 'language', this.$namespace),
        //    //    lang;
        //    //
        //    //if(absoluteName){
        //    //    lang = Ext.create(absoluteName.absoluteName);
        //    //
        //    //    if (lang) {
        //    //        CRM.core.managers.LanguageManager.register(lang, this.$namespace)
        //    //        this.language = lang;
        //    //    }
        //    //}
        //}

        //this.language = this.isModule ?  LangMgr.loadLanguage(this.$namespace) : LangMgr.getLang();
        this.$lang = this.language = LangMgr.loadLanguage(this.$namespace);
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

    run: Ext.emptyFn,

    /**
     * @private
     */
    onBeforeLaunch: function () {
        var me = this,
            controllers, c, cLen, controller;

        //me.setModuleConfig(me.$namespace);
        me.initModuleCfg();

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

        if(me.autoLoadControllers) {
            me.onLaunchCtrllers();
        }
    },

    /**
     * private
     */
    setUpControllers: function(){
        this.initControllers();
        this.onLaunchCtrllers();
        this.finishInitControllers();
    },

    onLaunchCtrllers: function(){
        var me = this, controller,
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
        var viewport = this.getView('Viewport');

        if (viewport) {
            viewport.create();
        }
    },

    initMainView: function (view) {
        var me = this;
        if (me.placeholder) {

            Ext.isString(me.placeholder) && (me.placeholder = {
                selector: me.placeholder
            });

            var nameView = view || this.placeholder.view || 'Main';

            // view discovery
            if(!me.taskRenderView){
                //listen to next firing shellLaunch event to make sure stop the render view task will be stop
                me.controlRenderViewsTaskEvents();
                me.taskRenderView = Ext.TaskManager.start({
                    run: function () {
                        //console.info('INFO: Render view task via placeholder is running')
                        var selects = Ext.ComponentQuery.query(me.placeholder.selector);
                        me.viewInjection(nameView, selects[0], me);
                    },
                    interval: 0
                });
            }

            //setTimeout(function () {
            //    var selects = Ext.ComponentQuery.query(me.placeholder.selector);
            //    me.viewInjection(nameView, selects[0], me);
            //}, 0);
        } else {
            //console.log('WARNING: a placeholder is needed in order to render ' + nameView + 'view.');
        }
    },

    /**
     * Funcion que garantiza que la tarea que inyecta la vista no se ejecute indefinidamente
     */
    controlRenderViewsTaskEvents: function(){
        var me = this;
        me.on({
            shellLaunch: function(instance, scope){
                if(instance && this.taskRenderView){
                    //Ext.util.TaskManager.stop(this.taskRenderView);
                    Ext.util.TaskManager.stopAll();
                }
            },
            scope: me
        });
    },

    viewInjection: function (name, container, scope, options) {
        var _scope = scope || this;

        var view = _scope.getView(name), instance;
        _scope.fireEvent('shellBeforeLaunch', _scope);
        if (!view) {
            /*console.log('WARNING: Module ' + _scope.name
            + ' not define ' + name + ' view');*/
        } else {
            if(options){
                instance = view.create(options);
            }else{
                instance = view.create();
            }

            container.add(instance);
            container.doLayout();
            _scope.fireEvent('shellLaunch', instance, _scope);
        }

        return instance;
    },

    render: function(placeholder, view, options){
        if(!placeholder){
            this.initMainView(view || false);
            return;
        }
        var nameView = view || 'Main', instance,
            selects = Ext.ComponentQuery.query(placeholder);

        /*if(!selects.length){
            console.info('ERROR: There is not component that matches with ' + placeholder + 'selector!');
        }*/

        instance = options && Ext.isObject(options) && !Ext.Object.isEmpty(options) ?
            this.viewInjection(nameView, selects[0], this, options) :
            this.viewInjection(nameView, selects[0]);

        return instance;
    },

    getController: function (name) {
        var me = this,
            controllers = me.controllers,
            className, controller;

        controller = controllers.get(name);
        //console.log('CONTROLLER:>> ' + me.$className + ': ' + name)

        if (!controller) {
            className = me.getModuleClassName(name, 'controller');

            controller = Ext.create(className, {
                application: me,
                id: name,
                getModuleCfg: function () {
                    if (this.application.isModule) {
                        return this.application.getModuleCfg();
                    }
                }
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
            depth = 1, module;
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

            module = Ext.create(className, {
                application: me,
                depth: depth,
                id: name,
                moduleClassName: name
            });
            me.modules.add(module);
        }
        return module;
    },

    hasModules: function () {
        return this.modules.getCount();
    },

    getModuleCfg: function () {
        return this.isModule ? this.moduleCfg : false;
    },

    /**
     * /Inicia la configuracion del modulo (esto solo es para los modulos)
     */
    initModuleCfg: function () {
        var me = this, ConfClass = false,
            namespace = me.$namespace;

            me.moduleCfg = Ext.create(namespace + ".config", {
                setValue: Ext.Function.flexSetter(function (name, value) {
                    this[name] = value;
                })
            });
    },

    getLanguage: function () {
        /* calling LanguageManager */
        if (me.isModule) {
            return LangMgr.getLang(this);
        }
    },

    //setModuleConfig: function (name) {
    //    var me = this;
    //    Ext.require(name + '.config', function(){
    //        if (Ext.ClassManager.isCreated(name + '.config')) {
    //            me.moduleCfg = Ext.ClassManager.get(name + '.config') || null
    //        }
    //    });
    //},

    getApplication: function () {
        return this;
    },

    /**
     * Returns a View class with the given name.  To create an instance of the view,
     * you can use it like it's used by Application to create the Viewport:
     *
     *     this.getView('Viewport').create();
     *
     * @param {String} name
     *
     * @return {Ext.Base} a view class.
     */
    getView: function(view) {
        var name = Ext.app.Controller.getFullName(view, 'view', this.$namespace),
            classFromManager = Ext.ClassManager.get(name.absoluteName);
        //aqui le agregue que si la vista no esta cargada ya entnces la cargue
        if(!classFromManager && name){
            Ext.syncRequire(name.absoluteName);
            classFromManager = Ext.ClassManager.get(name.absoluteName);
        }
        return name && classFromManager;
    },

    loadScriptByNameSpace: function(namespace){
        Ext.syncRequire(namespace);
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

    /**
     * Load all app's core files
     */
    Ext.require([
        'CRM.core.utils.GlobalFuntions',
        'CRM.core.managers.LanguageManager',
        'CRM.core.managers.ModuleManager',
        'CRM.ux.fancymenu.Fancymenu',
        'CRM.ux.overrides.GeneralOverrides'
    ]);

    //if (config.globalConfig === true) {
    //    //Ext.Loader.setPath(config.name, config.appFolder || 'app');
    //    Ext.require(config.name + '.config');
    //}

    //Ext.app.Application.instance = Ext.create('Ext.app.BundledApplication', config);
    Ext.onReady(function () {
        Ext.app.Application.instance = new App();
    });


};