Ext.ns('Maestro.ConfigurarReporte.base');

Maestro.ConfigurarReporte.base.Controller = Ext.extend( Ext.util.Observable, {
	application: null,
	init: Ext.emptyFn,
	onLaunch: Ext.emptyFn,
	constructor: function(){
		var me = this;

		me.addEvents("launch");

	    Maestro.ConfigurarReporte.base.Controller.superclass.constructor.apply(me, arguments);
	},
	doInit: function(app) {
        var me = this;

        if (!me._initialized) {
            me.init(app);
            me._initialized = true;
        }
    },
    finishInit: function(app) {
        var me = this,
            controllers = me.controllersManager,
            controller, i, l;

        if (me._initialized && controllers && controllers.length) {
            for (i = 0, l = controllers.length; i < l; i++) {
                controller = me.getController(controllers[i]);
                controller.finishInit(app);
            }
        }
    },
    registerEvents: function(listeners, scope) {
        var me = this,
            app = me.getApplication(),
            selector, post, viewRef, viewChildQuery;

        for (selector in listeners) {
            post = selector.indexOf(' ');
            viewRef = (post!=-1)?selector.slice(0, post):selector;

            app.addEventContainer(viewRef, {
                childSelector: (post!=-1)?selector.slice(post+1):null,
                listeners: listeners[selector],
                scope: this
            });
        }
    },
    getController: function(id) {
        var me = this,
            app = me.application;

        return app && app.getController(id);
    },
    getStore: function(name) {
        var me = this,
            app = me.application;

        return app && app.getStore(name);
    },
    getView: function(view) {
        var me = this,
            app = me.application;

        return app && app.getView(view);
    },
    addView: function(ref, objt){
        var me = this,
            app = me.application;

        return app && app.addView(ref, objt);
    },
    getResource: function(resource){
        var me = this,
            app = me.application;

        return app && app.getResource(resource);
    },
    getApplication: function() {
        return this.application;
    },
});

Maestro.ConfigurarReporte.base.App = Ext.extend( Maestro.ConfigurarReporte.base.Controller, {
	scope: undefined,
    enableQuickTips: true,
    autoCreateMainView: false,
    launch: Ext.emptyFn,
    initConfig : null,
    constructor: function(config) {
        var me = this;

        me.initConfig = config;

        Maestro.ConfigurarReporte.base.App.superclass.constructor.apply(this, arguments);

        me.doInit(me);

        me.initElementsManager();
        me.initControllers();
        me.onBeforeLaunch();

        me.finishInitControllers();
    },
    initElementsManager: function() {
        var me = this;
        me.viewsManager = new Ext.util.MixedCollection();
        me.storesManager = new Ext.util.MixedCollection();
        me.controllersManager = new Ext.util.MixedCollection();
        me.resourcesManager = new Ext.util.MixedCollection();
        me.eventContainer = new Ext.util.MixedCollection();
    },
    initControllers: function() {
        var me = this,
            controllers = me.controllers;

        for (var i = 0, ln = controllers.length; i < ln; i++) {
            me.getController(controllers[i]);
        }
    },
    initView: function(ref){
        var me = this,
            viewConfig = me.searchElementConfig(ref, 'views'),
            className, view, storesRequired, viewsRequired;

        if(viewConfig){

            if(viewConfig.stores)
                storesRequired = me.getElementsRequired(viewConfig.stores, 'store');

            if(viewConfig.views)
                viewsRequired = me.getElementsRequired(viewConfig.views, 'view');

            className  = me.getElementClassName(viewConfig, 'view');

            view = me.createClass(className, {
                appInitConfig: me.initConfig,
                required: {
                    stores : storesRequired,
                    views : viewsRequired
                }
            });
        	
            me.attachViewEvents(ref, view);

            if(me.mainView && ref == me.mainView)
                view.on('destroy', me.destroy, me);

            me.viewsManager.add(viewConfig.ref, view);
        }

        return view;
    },
    initStore: function(ref){
        var me = this,
            storeConfig = me.searchElementConfig(ref, 'stores'),
            className, store;

        if(storeConfig){

            className  = me.getElementClassName(storeConfig, 'store');

            store = me.createClass(className, {
                appInitConfig: me.initConfig
            });

            me.storesManager.add(storeConfig.ref, store);
        }

        return store;
    },
    initResource: function(ref){
        var me = this,
            resourceConfig = me.searchElementConfig(ref, 'resources'),
            className, resource, storesRequired;

        if(resourceConfig){

            if(resourceConfig.stores)
                storesRequired = me.getElementsRequired(resourceConfig.stores, 'store');

            className  = me.getElementClassName(resourceConfig, 'resource');

            resource = me.createClass(className, {
                appInitConfig: me.initConfig,
                required: {
                    stores : storesRequired
                }
            });

            me.resourcesManager.add(resourceConfig.ref, resource);
        }

        return resource;
    },
    getController: function(config) {
        var me = this,
            className, controller,
            name = (me.isString(config))?config: config.name;

        controller = me.controllersManager.get(name);

        if (!controller) {
            className  = me.getElementClassName(config, 'controller');

            controller = me.createClass(className, {});
            
            controller.application = me;

            me.controllersManager.add(name, controller);

            if (me._initialized) {
                controller.doInit(me);
            }
        }

        return controller;
    },
    getView: function(ref){
        var me = this,
            viewsManager = me.viewsManager,
            view;

        view = viewsManager.get(ref);

        if(!view)
            view = me.initView(ref);

        return view;
    },
    addView: function(ref, objt){
        var me = this,
            viewsManager = me.viewsManager;

        if( !me.searchElementConfig(ref, 'views') )
            viewsManager.add(ref, objt);
    },
    getStore: function(ref){
        var me = this,
            storesManager = me.storesManager,
            store;

        store = storesManager.get(ref);

        if(!store)
            store = me.initStore(ref);

        return store;
    },
    getResource: function(ref){
        var me = this,
            resourcesManager = me.resourcesManager,
            resource;

        resource = resourcesManager.get(ref);

        if(!resource)
            resource = me.initResource(ref);

        return resource;
    },
    getElementsRequired: function(elems, kind){
        var me = this,
            fnName = 'get'+me.capitalizeString(kind),
            result = {};

        for (var i = 0, ln = elems.length; i < ln; i++) {
            var elemRef = elems[i];
            result[elemRef] = me[fnName](elemRef);
        }

        return result
    },
    getElementClassName: function(config, kind){
        var me = this,
            namespace = ((me.isString(config))?null: config.namespace) || me.namespace,
            name = (me.isString(config))?config: config.name;

        return namespace+'.'+kind+'.'+name;
    },
    searchElementConfig: function(ref, arrayName){
        var me = this,
            elements = me[arrayName];

        for (var i = 0, ln = elements.length; i < ln; i++) {
            if( me.isObject(elements[i]) && elements[i].ref == ref)
                return elements[i];
        }
    },
    addEventContainer: function(ref, elem){
        var me = this,
            eventContainer =  me.eventContainer,
            events;

        events = eventContainer.get(ref);
        if(!events)
            eventContainer.add(ref, [elem]);
        else{
            events.push(elem);
        }
    },
    attachViewEvents: function(ref, view){
        var me = this,
            events, eventConf, elemAttach;

        if(me.eventContainer.containsKey(ref)){
            events = me.eventContainer.get(ref);
            for(var i = 0, ln=events.length;i<ln;i++){
                eventConf = events[i];
                elemAttach = (eventConf.childSelector)?view[eventConf.childSelector]:view;
                if(elemAttach)
                    elemAttach.on(Ext.applyIf( eventConf['listeners'], {scope: eventConf['scope']||me} ));
            }
        }
    },
    onBeforeLaunch: function() {
        var me = this,
            controllers, c, cLen, controller;

        if (me.enableQuickTips) {
            me.initQuickTips();
        }

        if (me.autoCreateMainView && me.mainView) {
            me.initMainView();
        }


        me.launch.call(me.scope || me);
        me.launched = true;
        me.fireEvent('launch', me);
		
        controllers = me.controllersManager.items;
        cLen = controllers.length;

        for (c = 0; c < cLen; c++) {
            controller = controllers[c];
            controller.onLaunch(me);
        }
    },
    initQuickTips: function() {
        Ext.QuickTips.init();
    },
    initMainView: function(){
        var me = this;
        Ext.onReady(function() {
            me.getView(me.mainView);
        });
    },
    getMainView: function(){
        var me = this;
        return me.getView(me.mainView);
    },
    finishInitControllers: function() {
        var me = this,
            controllers, i, l;

        controllers = me.controllersManager.getRange();

        for (i = 0, l = controllers.length; i < l; i++) {
            controllers[i].finishInit(me);
        }
    },
    getApplication: function(){
        return this;
    },
    destroy: function(){
        var me = this;

        delete me.viewsManager;
        delete me.storesManager;
        delete me.controllersManager;

        delete me;
    },
    createClass: function(className, config){
		var args = Array.prototype.slice.call(arguments, 1);
	    var clsClass = eval(className);
	    function F() {
	        return clsClass.apply(this, args);
	    }
	    F.prototype = clsClass.prototype;
	    return new F();
    },
    isString: function(value){
		return typeof value === 'string';
    },
    capitalizeString: function(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    },
    isObject: (toString.call(null) === '[object Object]') ?
	    function(value) {
	        // check ownerDocument here as well to exclude DOM nodes
	        return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
	    } :
	    function(value) {
	        return toString.call(value) === '[object Object]';
	    },
});