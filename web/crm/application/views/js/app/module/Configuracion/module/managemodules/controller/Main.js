Ext.define('Modules.controller.Main', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'ManageModules', selector: 'gestmodules'},
    ],

    init: function () {
        var me = this;
        this.getLang();

        this.listen({
            component: {
                'gestmodules': {
                    beforeshow: this.loadConfig,
                    add: this.showBtns
                },
                'gestmodules toggleslidefield': {
                    change: this.validateForm
                },
                'gestmodules button[action=apply]': {
                    click: this.save
                },
                'gestmodules button[action=cancel]': {
                    click: this.closeForm
                }
            }
        });
    },

    closeForm: function(btn){
        btn.up('gestmodules').close();
    },

    validateForm: function(toogleslide, newValue, oldValue){
        var me = this,
            form = toogleslide.up('gestmodules'),
            dirty = form.isDirty(),
            apply = form.down("button[action=apply]"),
            brothers = toogleslide.up('fieldcontainer').query("toggleslidefield");
        apply.setDisabled(!dirty);

        //esto es para validar que si ningun modulo hijo esta activo entonces el padre pase a inactivo
        if(!this.extraParams){
            this.extraParams = {}
        }

        this.extraParams[toogleslide.parentModule] = false;
        brothers.every(function(field){
            var value = field.getValue();
            if((Ext.isBoolean(value) && value) || value == "true"){
                me.extraParams[toogleslide.parentModule] = true;
                return false; //stop iteration
            }
            return true; //keep iterating
        });
    },

    loadConfig: function(form, eOpts){
        var me = this,
            url = this.buildUrl('load');

        if(url && !form.items.getCount()){
            Ext.Ajax.request({
                url: url,
                callback: function (options, success, response) {
                    var result = Ext.decode(response.responseText),
                        config = result.data,
                        container = {
                            xtype: 'fieldcontainer',
                            defaultType: 'fieldcontainer',
                            layout: 'anchor',
                            defaults: {
                                defaultType: 'toggleslidefield',
                                anchor: '100%'
                            },
                            fieldLabel: me.etiquetas.lbModules,
                            labelStyle: 'font-variant:all-small-caps;font-size:16px;color:#15428b',
                            labelWidth: 100,
                            border: false,
                            autoScroll: true
                        };
                    if(!config.idconfmodulo){
                        var items = me.buildItems();
                    } else {
                        var modules = JSON.parse(config.config),
                            values = JSON.parse(config.valores),
                            items = me.buildItems({modules:modules, values:values});
                    }

                    if(items.length){
                        container.items = items;
                        form.add(container);
                    }

                    //AKI ME FALTA VERICAR QUE EN CASO DE QUE YA EXISTA UNA CONFIGURACION ENTONCES AGREGE LOS MODULOS
                    //QUE ESTEN EN EL MANAGER Y NO ESTEN EN LA CONFIGURACION
                }
            });
        }
    },

    showBtns: function(form, cmp, index, eOpts){
        form.down("button[action=apply]").show();
        form.down("button[action=cancel]").show();
    },

    save: function(btn, evnt){
        var me = this,
            form = btn.up('form'),
            modules = me.getDataModulesToJSON(),
            url = this.buildUrl('save'),
            extraParams = {modules: Ext.encode(modules)};

        if(this.extraParams){
            extraParams = Ext.Object.merge(extraParams, this.extraParams)
        }

        form.submit({
            url: url,
            params: extraParams,
            success: function(basicForm, action) {
                var result = action.result,
                    record = result.record,
                    apply = form.down("button[action=apply]")

                var msg = me.etiquetas.msgSaveSuccess.getSingular('female').get(me.etiquetas.lbconfig) + ' ' +
                    me.etiquetas.msgReloadApp;
                mostrarMensaje(2, msg, function (response) {
                        if (response === 'ok') {
                            document.location.reload();
                        } else {
                            mostrarMensaje(1, me.etiquetas.msgNextReload);
                        }
                })
                apply.disable();
                if(record){ // esto es para convertir los valores string en booleanos nativos
                    for (key in record) {
                        record[key] = record[key] == "true";
                    }
                    basicForm.setValues(record);
                }
            },
            failure: function(basicForm, action) {
                mostrarMensaje(6, me.etiquetas.msgSaveFail.getSingular('female').get(me.etiquetas.lbconfig));
            }
        });
    },
    //@private
    buildItems: function(config){
        var me = this,
            hasModules = config && config.modules,
            hasValues = config && config.values,
            modules = (config && config.modules) ? config.modules : ModuleMgr.getAll(),
            items = new Ext.util.MixedCollection();

        modules.every(function(module){
            if(module.isModule && module.securityFunction){
                var hideable = config ? module.hideable : module.moduleCfg.hideable,
                    parent = hasModules ? module.parent : module.application;

                if(hideable !== false){ // esto es para excluir el propio modulo de configuracion
                    var item = items.get(parent.$className),
                        $lang = LangMgr.loadLanguage(module.$namespace),
                        moduleName = $lang && $lang.moduleName ? $lang.moduleName : module.$namespace,
                        state = hasValues && hasValues[module.$namespace] ? hasValues[module.$namespace] : true;
                    checkbox = {
                        xtype: 'toggleslidefield',
                        labelSeparator: '',
                        name: module.$namespace,
                        style: 'margin-left: 15px',
                        allowBlank: true,
                        labelWidth: 180,
                        onText: me.etiquetas.lbActivo,
                        offText: me.etiquetas.lbInactivo,
                        state: hasValues ? state == "true" : state,
                        fieldLabel: '<span class="icondistra-ajustar">' + moduleName + '</span>',
                        parentModule: parent.$namespace
                    };
                    //checkbox = {boxLabel: module.$lang.moduleName, name: module.$namespace, style: 'margin-left: 15px'};
                    me.dataModuleToJSON(module, config);

                    if(!item){
                        var $parentlang = LangMgr.loadLanguage(parent),
                            moduleName = $parentlang && $parentlang.moduleName ? $parentlang.moduleName : parent.$namespace,
                            childs = [
                                {
                                    xtype: 'component',
                                    html: me.getModuleHeader(moduleName)
                                },
                                checkbox
                            ];

                        fildcontainer = {
                            items: childs,
                            margin: '0 0 15 0'
                        };

                        //esto es para agregar un estilo diferente a los fieldcontainer pares
                        if(!(items.length % 2)){
                            fildcontainer.cls = 'x-check-group-alt';
                        }

                        items.add(parent.$className, fildcontainer);
                        me.dataModuleToJSON(parent, config);
                        return true; // keep iterating
                    }
                    item.items.push(checkbox);
                }
            }
            return true; // keep iterating
        });
        return items.length ? items.items : [];
    },

    //@private
    dataModuleToJSON: function(module, custom){
        if(!this.jsonmodules){
            this.jsonmodules = new Ext.util.MixedCollection();
        }

        var alredyRegistred = this.jsonmodules.get(module.$className);

        if(!alredyRegistred){
            var objt;
            if(custom){
                objt = module;
            } else {
                objt = Ext.copyTo({}, module,[
                    'securityFunction',
                    '$namespace',
                    '$className',
                    'isModule'
                ], true);
                objt.parent = {
                    $className: module.application.$className,
                    $namespace: module.application.$namespace,
                    isModule: module.application.isModule
                };
                objt.hideable = module.moduleCfg.hideable;
            }
            this.jsonmodules.add(module.$className, objt);
        }
    },
    //@private
    getDataModulesToJSON: function(){
        return this.jsonmodules.items || false;
    },
    //@private
    getModuleHeader: function(header){
        return '<div>' +
            '<div style="width:180px;font-variant:all-small-caps;font-size:16px;color:#15428b;margin-left:10px;"><b>' + header + '</b>' +
            '</div>' +
            '<hr style="height: 3px;border-width:0;margin-top: 3px;background-color:#99bbe8;">' +
            '<hr style="height: 3px;border-width:0;margin-top:-9px;background-color:#15428b;position:absolute;left:10px;width:200px">' +
            '</div>'
    }

    //grantActions: function (cmp, eOpts) {
    //    this.validateGrantedActions({container: this.getMainGridContratacion()});
    //},

});