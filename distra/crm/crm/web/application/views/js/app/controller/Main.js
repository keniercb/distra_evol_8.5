Ext.define('CRM.controller.Main', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'initpage', selector: 'initpage'},
        {ref: 'column_navpanel', selector: 'column_navpanel'},
        {ref: 'main_tabpanel', selector: 'main_tabpanel'},
        {ref: 'shell', selector: 'shell'},
    ],

    init: function () {
        var me = this;
        this.modulesFromSecurity = new Ext.util.MixedCollection(); // contendra todos los modulos devueltos en la sincronizacion con seguridad
        this.etiquetas = this.application.language || LangMgr.getLang();

        this.listen({
                global: {
                    beforeloadmodule: this.validateActiveModules
                },
                component: {
                    'column_navpanel fancymenu': {
                        click: this.onSelectFunct
                    },
                    'column_navpanel button[action=showpin]': {
                        toggle: this.showPinBtn
                    },
                    'column_navpanel button[action=savepin]': {
                        click: this.savePinModules
                    },
                    'column_navpanel searchfield': {
                        search: this.onFilterMenuItems,
                        clear: this.onClear
                    },
                    'column_navpanel tool[type=pin], column_navpanel tool[type=unpin]': {
                        click: this.pingNavBar
                    },
                    'button[action=pin]': {
                        toggle: this.pinFunctionality,
                        beforerender: function (btn, eOpts) {
                            btn.setTooltip(me.etiquetas.qtipShortcut.get(btn.menuitem.text.toLowerCase()));
                        }
                    },
                    'main_tabpanel': {
                        afterrender: this.autoRenderModules,
                        beforerender: this.beforeRenderTabPanel,
                        click: me.collapseNavbar
                    },
                    'main_tabpanel > panel': {
                        render: this.enableKeyMap,
                        activate: this.enableKeyMap,
                        deactivate: this.disableKeyMap,
                        beforeclose: this.disableKeyMap
                    }
            }
        });

        this.application.on({
            apploaded: function () {
                var loader = Ext.fly('loading-mask');
                if (loader) {
                    loader.hide();
                }

                //TODO descomentarear las lineas siguientes para deshabilitar el click derecho
                //Eliminando el contextmenu del navegador
                /*Ext.get(window.document).on(
                    {
                        'contextmenu': function (e) {
                            e.preventDefault();
                        }
                    }
                );*/
            },
            loadmodule: function () {

            }
        });
    },
    //Events functions

    validateActiveModules: function(module, application){
        var activemodules = this.application && this.application.activeModules;

        if(activemodules){
            var keys = Object.keys(activemodules);
            if(keys.indexOf(module) !== -1){
                return activemodules[module] == "true";
            }
        }
        return true;
    },

    onSelectFunct: function (menu, item, eventObj, eOpts) {
        var tabpanel = this.getMain_tabpanel(),
            instance = this.runModule(item);

        if (instance) {
            tabpanel.setActiveTab(instance);
        }
    },
    runModule: function (item) {
        if(item) {
            var moduleId = item.namespace,
                iconCls = item.iconCls,
                module = ModuleMgr.get(moduleId),
                tabpanel = this.getMain_tabpanel();
            console.log('MODULO:', item, module)
            if (module && tabpanel) {
                var instance = module.isRunning ? moduleId :
                    module.run({iconCls: iconCls, id: moduleId});

                /*//se le inyecta al modulo el identificador de la funcionalidad de seguridad
                module.securityData = {idfuncionalidad: item.idfunctionatity, referencia: item.reference}

                if(module.securityFunction){
                    this.defineSecurityInfo(module);
                }*/

                return instance;
            }
        }

        return null;
    },

    /**
     * Funcion que si el modulo es una funcion de seguridad, entonces setea al modulo basePath y el controller
     * a partir de la funcionalidad de Seguridad
     */
    defineSecurityInfo: function(module){
        if(module.securityData.referencia){
            var re = new RegExp("(.+)index.php\/(\\w+)\/\\w+"),
                info = module.securityData.referencia.match(re);

            if(info[1] && info[2]){
                module.getModuleCfg().setValue({
                    basePath: info[1],
                    controller: info[2]
                });
            }
        }

    },

    /* FUNCIONES RELACIONADAS AL ANCLAJE DE LOS MODULOS */
    showPinBtn: function (btn, pressed, eOpts) {
        var pingBtns = Ext.ComponentQuery.query('button[action=pin]'),
            qtip = !pressed ? this.etiquetas.qtipShowPin : this.etiquetas.qtipHidePin;

        if (pingBtns.length) {
            pingBtns.every(function (btn) {
                btn.setVisible(pressed);
                return true;
            })
        }
        btn.setTooltip(qtip);
    },

    pingNavBar: function (tool) {
        var type = tool.type;

        if (type != 'pin' && type != 'unpin') { // si no es anclar o desanclar no hacer nada
            return;
        }

        var findXtypeTool, findTool,
            navbar = tool.toolOwner,
            tools = navbar.tools;

        findXtypeTool = type === 'pin' ? 'unpin' : 'pin';
        type === 'unpin' ? navbar.pinned = true : delete navbar.pinned;

        //buscar el tool opuesto
        tools.every(function (tl) {
            if (tl.type === findXtypeTool) {
                findTool = tl;
                return false;
            }
            return true;
        });

        findTool.show();
        tool.hide();
    },

    pinFunctionality: function (btn, pressed, eOpts) {
        Ext.EventObject.stopPropagation(); // evitando que se dispare el clic del menu
        var me = this,
            navpanel = this.getColumn_navpanel(),
            btnSavePin = navpanel.down('button[action=savepin]'),
            menuitem = btn.menuitem;

        if (!me.pinModules) {
            me.pinModules = new Ext.util.MixedCollection();
        }
        if (!me.unpinModules) {
            me.unpinModules = new Ext.util.MixedCollection();
        }
        if (pressed) {
            btn.setIconCls('icondistra-anclar');
            !menuitem.autorun ?
                me.pinModules.add(menuitem.namespace, menuitem.idfunctionatity) :
                me.unpinModules.removeAtKey(menuitem.namespace);
        } else {
            btn.setIconCls('icondistra-desanclar');
            menuitem.autorun ?
                me.unpinModules.add(menuitem.namespace, menuitem.idfunctionatity) :
                me.pinModules.removeAtKey(menuitem.namespace);
        }

        btnSavePin.setVisible(me.pinModules.getCount() || me.unpinModules.getCount());
    },

    savePinModules: function (btn) {
        var me = this,
            pin = me.pinModules ? me.pinModules.items : [],
            unpin = me.unpinModules ? me.unpinModules.items : [],
            params = {};

        if (!pin.length && !unpin.length) {
            // si no hay ningun cambio no hacer nada
            return;
        }

        if (!isNaN(perfil.idusuario)) {
            params.idusuario = perfil.idusuario;
        }
        if (!isNaN(perfil.idestructuracomun)) {
            params.idestructuracomun = perfil.idestructuracomun;
        }
        if (pin.length) {
            params.add = Ext.encode(pin);
        }
        if (unpin.length) {
            params.del = Ext.encode(unpin);
        }

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'saveShortcuts'}),
            params: params,
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                if (result.errors && result.errors.length) {
                    mostrarMensaje(1, me.etiquetas.textConfiguracionInicioAutomaticoEx);
                } else {
                    mostrarMensaje(1, me.etiquetas.msgSaveSuccess.getSingular('f').get(me.etiquetas.textConfiguracionInicioAutomatico.toLowerCase()));
                }
                me.updateMenuAutorunState();
                btn.setVisible(false);
            }
        });
    },

    updateMenuAutorunState: function(){
        if(this.pinModules.length) {
            this.changeAutorunState(this.pinModules, true);
        }

        if(this.unpinModules.length) {
            this.changeAutorunState(this.unpinModules, false);
        }
    },

    changeAutorunState: function(mixed, value){
        var navbar = this.getColumn_navpanel();
        mixed.each(function (item, index, length) {
            var fancymenuitem = navbar.down("fancymenuitem[idfunctionatity=" + item + "]");

            if(fancymenuitem){
                fancymenuitem.autorun = value;
            }
            return true;
        });
        // reseting collection for the next time
        mixed.removeAll();
    },

    autoRenderModules: function (panel, eOpts) {
        var me = this,
            instance = false,
            tabpanel = me.getMain_tabpanel();
        if (me.modulesFromSecurity.getCount()) {
            me.modulesFromSecurity.each(function (item) {
                if (item.autorun) {
                    instance = me.runModule(item);
                }
            });
            if (instance) {
                tabpanel.setActiveTab(instance);
            }
        }
    },

    beforeRenderTabPanel: function (panel, eOpts) {
        var me = this;
        if (me.modulesFromSecurity.getCount()) {
            var navpanel = me.getColumn_navpanel();
            me.modulesFromSecurity.each(function (item) {
                if (item.autorun) {
                    navpanel.down('tool[type=unpin]').show();
                    navpanel.down('tool[type=pin]').hide();
                    navpanel.pinned = false; // pin's flag control
                    navpanel.collapse();
                    return false; // break iteration
                }
            });
        }

    },

    collapseNavbar: function (cmp, event, target) {
        var navpanel = this.getColumn_navpanel();

        if (!navpanel.pinned) {
            navpanel.collapse();
        }
    },

    /* Funciones relacionadas con la busqueda dentro del menu de navegacion */
    onFilterMenuItems: function (field) {
        var me = this, matches, panelSearch,
            pattern = field.getValue(),
            navpanel = this.getColumn_navpanel();
        /**
         * Primero se limpia si existe una busqueda anterior. esto es en caso de que se realice una nueva busqueda
         */
        this.onClear();

        matches = this.modulesFromSecurity.filterBy(function (item, key) {
            var regExp = new RegExp(pattern, "gi");
            item.text = me.removeSearchMark(item.text);
            var containFlag = regExp.test(item.text);

            if (containFlag) {
                item.text = item.text.replace(regExp, '<span class="ca-yellow">$&</span>');
            }
            return containFlag
        });

        var flag = matches.getCount(),
            confObj = {
                title: this.etiquetas.lbSearchResults,
                id: 'searchpanel'
            };
        !flag ? confObj.html = '<span class="ca-icon icondistra-info" style="text-shadow: 0 0 0 !important; opacity: 0.7;"></span>' +
        '<div style="border-left: 5px solid #d9e7f8; left: 37px; position: absolute; top: 2px">' +
        '<div style="margin-left: 5px">' + this.etiquetas.msgSearchNoMatches.getSingular().get() + '</div>' +
        '</div>'
            :
            confObj.items = {
                xtype: 'fancymenu',
                margin: '0 0 10 0',
                border: false,
                floating: false,
                items: matches.items,
                createPinBtn: true
            }

        panelSearch = Ext.create('Ext.panel.Panel', confObj);
        navpanel.items.get(0).items.each(function (item) {
            item.setVisible(false);
        });

        navpanel.items.get(0).insert(0, panelSearch);
        panelSearch.expand();
        navpanel.hasSearchPanel = true;
    },

    removeSearchMark: function(text){
        var regExp = new RegExp("(.*)\<span\\s+class\=\"ca-yellow\"\>(.+)\<\/span\>(.*)", "gi");
        return text.replace(regExp, "$1$2$3");
    },

    onClear: function () {
        var navpanel = this.getColumn_navpanel();

        if (navpanel.hasSearchPanel) {
            var find = navpanel.items.get(0).getComponent('searchpanel');
            navpanel.items.get(0).remove(find, false);
            navpanel.items.get(0).doLayout();
            delete navpanel.hasSearchPanel;
        }

        navpanel.items.get(0).items.each(function (item) {
            item.setVisible(true);
        });
    },

    beforeSecuritySync: function () {
        var me = this, modules = ModuleMgr.getAll(),
            modhierarchy = [];

        modules.every(function (item) {
            if (item.securityFunction) {
                function getModuleTpl(item) {
                    var config = item.getModuleCfg(), // obteniendo la configuracion del modulo
                        name = item.language && item.language.moduleName ? item.language.getModuleName() :
                            (config.name ? config.getName() : false),
                        description = item.language && item.language.moduleDescription ? item.language.moduleDescription :
                            (config.description ? config.description : false),
                        fullpath = config.controller ? config.getBasePath() + 'index.php/' + config.controller
                        + '/' + config.controller : false;

                    return {
                        id: item.id,
                        name: name,
                        namespace: item.$namespace,
                        depth: item.depth,
                        disabled: item.disabled,
                        path: config.getBasePath(),
                        controller: config.controller ? config.getController() : false,
                        fullpath: fullpath,
                        iconCls: config.iconCls ? config.iconCls : false,
                        description: description
                    };
                }

                var module = getModuleTpl(item),
                    parent = item.application;

                module.parent = getModuleTpl(parent);

            }

            modhierarchy.push(module);
            return true;
        });
        me.securitySync(modhierarchy);
    },

    securitySync: function (modules) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'securitySync'}),
            params: {
                modules: Ext.encode(modules),
                idusuario: !isNaN(perfil.idusuario) ? perfil.idusuario : false
            },
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                if (result.length) {
                    var items = [];
                    for (var i = 0; i < result.length; i++) {
                        var icon = result[i].iconCls || 'icondistra-iniciar',
                            ctrldisabled = !result[i].hidden ?
                                (result[i].items ? result[i].items.length == 0 : true) :
                                result[i].hidden;
                        items.push(
                            {
                                title: '<span class="'+icon+'"></span>' + result[i].title, // esto es para ponerle el icono definido al modulo padre
                                hidden: ctrldisabled,
//                                 height: window.innerHeight-150,
                                layout:'fit',
                                items: Ext.create('CRM.ux.fancymenu.Fancymenu', {
                                    margin: '0 0 0 0',
                                    border: false,
                                    floating: false,
//                                     autoScroll:true,
//                                     overflowY:'auto',
                                    items: result[i].items,
                                    createPinBtn: true
                                })
                            }
                        );
                        me.modulesFromSecurity.addAll(result[i].items);
                    }
                    Ext.create('CRM.view.Viewport', {
                        items: [
                            //Ext.create('CRM.view.Toolbar',{region: 'north'}),//comentado hasta que tenga funcionalidad
                            Ext.create('CRM.view.NavPanel', {
                                region: 'west',
                                flex: 0.1,
                                minWidth: 220,
                                maxWidth: 250,
                                collapsible: true,
                                animCollapse: true,
                                margin: '5 0 5 5',
                                items: items
                            }),
                            Ext.create('CRM.view.TabPanel',
                                {
                                    region: 'center',
                                    margin: '5 5 5 0',
                                    flex: 0.9,
                                    plugins: [
                                        Ext.create('CRM.plugins.tabpanel.TabCloseMenu', {
                                            closeTabText: me.etiquetas.lbTabClose,
                                            closeOthersTabsText: me.etiquetas.lbTabCloseOthers,
                                            closeAllTabsText: me.etiquetas.lbTabCloseAll
                                        }),
                                        Ext.create('CRM.plugins.ComponentElementEvent')
                                    ]
                                }
                            )
                        ]
                    });
                    me.application.fireEvent('apploaded');
                    me.setModulesConfig();
                }
            }
        });
    },

    setModulesConfig:function(){
        var me = this,
            modsecurity = this.modulesFromSecurity.items;
        for(var k in modsecurity){
            var module = ModuleMgr.get(modsecurity[k].namespace);
            if(module){
                module.crm = {};
                module.crm.activeModules = me.application.activeModules;
                //se le inyecta al modulo el identificador de la funcionalidad de seguridad
                module.securityData = {idfuncionalidad: modsecurity[k].idfunctionatity, referencia: modsecurity[k].reference};

                if(module.securityFunction){
                    me.defineSecurityInfo(module);
                }

            }
        }
    },

    enableKeyMap: function (panel) {
        var idmodule = panel.id,
            module = ModuleMgr.get(idmodule);

        if (module) {
            if (!module.keyMap) {
                module.keyMap = new Ext.util.KeyMap({
                    target: Ext.getBody()
                });
            } else {
                if (!module.keyMap.isEnabled()) {
                    module.keyMap.enable();
                }
            }
        }
    },
    //TODO eliminar keymap cuando se destruya el panel
    disableKeyMap: function (panel) {
        var idmodule = panel.id,
            module = ModuleMgr.get(idmodule);

        if (module && module.keyMap && module.keyMap.isEnabled()) {
            module.keyMap.disable();
        }
    }
});